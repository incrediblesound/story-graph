const _ = require('lodash');

function writeSimpleType(data, result) {
  return `${result}const ${data.name} = new Type(\'${data.name}\')\n`;
}

function writeCompoundType(data, result) {
  let typeExpression = `${data.base}.extend('${data.name}')`;
  if (data.additions) {
    data.additions.forEach((decorator) => {
      typeExpression = `${decorator}(${typeExpression})`;
    });
  }
  return `${result}const ${data.name} = ${typeExpression} ;\n\n`;
}

function writeTypeDecorator(data, result) {
  let newResult = result;
  _.each(data.addition, value => {
    newResult += `const ${value} = function(type) {\n`;
    newResult += `\treturn type.extend(\'${value}\');\n}\n\n`;
  });
  return newResult;
}

// compile locations
function compileLocations(data, result) {
  let newResult = result;
  _.each(data, location => {
    newResult += `world.addLocation({ name: \'${location.name}\' });\n\n`;
  });
  return newResult;
}

// compile transitions
function compileTransitions(data, result) {
  let newResult = result;
  _.each(data, transition => {
    newResult += 'world.addRule({\n';
    newResult += '\tcause: {\n';
    newResult += `\t\ttype: [${transition.typeOrThing}, c.move_out, \'${transition.from}\'],\n`;
    newResult += '\t\tvalue: [\'\']\n\t},\n';
    newResult += '\tconsequent: {\n';
    newResult += `\t\ttype: [c.source, c.move_in, \'${transition.to}\'],\n`;
    newResult += `\t\tvalue: [c.source, \'${transition.text}\', \'${transition.to}\']\n\t},\n`;
    newResult += '\tisDirectional: true,\n';
    newResult += '\tmutations: null,\n';
    newResult += '\tconsequentThing: null\n';
    newResult += '})\n\n';
  });
  return newResult;
}

// helper for printing type decorators
function processTypes(types) {
  let result = '';
  let current;
  let tail = '';
  while (types.length > 1) {
    current = types.shift();
    result += `${current} (`;
    tail += ')';
  }
  return result + types[0] + tail;
}

function isEqual(a, b) {
  let result = true;
  _.each(a, (val, i) => {
    result = result && (val === b[i]);
  });
  return result;
}

// compile all the things
function compileThings(things, result) {
  let newResult = result;
  _.each(things, data => {
    newResult += `const ${data.name} = new Thing({`;
    newResult += `type: ${processTypes(data.types)}`;
    newResult += `, name: \'${data.name}\'`;
    newResult += `, locations: ${JSON.stringify(data.locations)}`;
    newResult += '})\n';
    newResult += `const ${data.name} = world.addThing(${data.name})\n\n`;
  });
  return newResult;
}

// compile all the rules
function compileRules(rules, result) {
  function matchEntity(data, rule, position) {
    let newResult;
    if (!data.length) {
      return '';
    }
    if (isEqual(data, rule.source) && isEqual(data, rule.target)) {
      newResult = position;
    } else if (isEqual(data, rule.source)) {
      newResult = 'c.source';
    } else {
      newResult = 'c.target';
    }

    if (position === 'c.target') {
      newResult = `, ${newResult}`;
    }
    return newResult;
  }

  let newResult = result;

  _.each(rules, rule => {
    newResult += 'world.addRule({\n';
    newResult += '\tcause: {\n';
    newResult += `\t\ttype: [${processTypes(rule.source.slice())}, c.encounter, `;
    newResult += `${processTypes(rule.target.slice())}],\n`;
    newResult += `\t\tvalue: [c.source, \'${rule.encounterText}\', c.target]\n\t},\n`;
    newResult += '\tconsequent: {\n';
    newResult += '\t\ttype: [],\n';
    const source = matchEntity(rule.consequentA, rule, 'c.source');
    const target = matchEntity(rule.consequentB, rule, 'c.target');
    newResult += `\t\tvalue: [${source}, \'' + rule.consequenceText + '\'${target}]\n\t},\n`;
    newResult += '\tisDirectional: true,\n';
    newResult += '\tmutations: null,\n';
    newResult += '\tconsequentThing: null/*{ type:\'\', name:\'\', members:[c.source,c.target],';
    newResult += 'lifeTime: 1, initialize: function(world){}}*/\n';
    newResult += '})\n\n';
  });

  return newResult;
}

// compile all the types
function compileTypes(types, result) {
  let newResult = result;
  const funcMap = {
    simple: writeSimpleType,
    compound: writeCompoundType,
    decorator: writeTypeDecorator,
  };
  _.each(types, data => {
    newResult = funcMap[data.type](data, result);
  });
  return newResult;
}

module.exports = structure => {
  let result = `const SG = require(\'./src/main.js\');\n
  const world = new SG.World();
  const Thing = SG.Thing;
  const Type = SG.Type;
  const c = SG.constants;\n`;

  result = compileTypes(structure.types, result);
  result = compileLocations(structure.locations, result);
  result = compileThings(structure.things, result);
  result = compileRules(structure.rules, result);
  result = compileTransitions(structure.transitions, result);

  result += 'const story = world.makeStory(4);\n console.log(story);\n';

  return result;
};
