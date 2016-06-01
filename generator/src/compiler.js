const _ = require('lodash');

function writeSimpleType(data, result) {
  return `${result}const ${data.name} = new Type(\'${data.name}\');\n\n`;
}

function writeCompoundType(data, result) {
  let typeExpression = `${data.base}.extend('${data.name}')`;
  if (data.additions) {
    data.additions.forEach((decorator) => {
      typeExpression = `${decorator}(${typeExpression})`;
    });
  }
  return `${result}const ${data.name} = ${typeExpression};\n\n`;
}

function writeTypeDecorator(data, result) {
  let newResult = result;
  _.each(data.addition, value => {
    newResult += `const ${value} = function(type) {\n`;
    newResult += ` return type.extend(\'${value}\');\n}\n\n`;
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
    newResult += '  cause: {\n';
    newResult += `    type: [${transition.typeOrThing}, c.move_out, \'${transition.from}\'],\n`;
    newResult += '    value: [\'\']\n  },\n';
    newResult += '  consequent: {\n';
    newResult += `    type: [c.source, c.move_in, \'${transition.to}\'],\n`;
    newResult += `    value: [c.source, \'${transition.text}\', \'${transition.to}\']\n  },\n`;
    newResult += '  isDirectional: true,\n';
    newResult += '  mutations: null,\n';
    newResult += '  consequentThing: null\n';
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
    newResult += `const ${data.name} = world.addThing(`;
    newResult += `new Thing({\n  type: ${processTypes(data.types)}`;
    newResult += `,\n  name: \'${data.name}\'`;
    newResult += `,\n  locations: ${JSON.stringify(data.locations)}`;
    newResult += '\n}));\n\n';
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
    newResult += '  cause: {\n';
    newResult += `    type: [${processTypes(rule.source.slice())}, c.encounter, `;
    newResult += `${processTypes(rule.target.slice())}],\n`;
    newResult += `    value: [c.source, \'${rule.encounterText}\', c.target]\n  },\n`;
    newResult += '  consequent: {\n';
    newResult += '    type: [],\n';
    const source = matchEntity(rule.consequentA, rule, 'c.source');
    const target = matchEntity(rule.consequentB, rule, 'c.target');
    newResult += `    value: [${source}, \'${rule.consequenceText}\'${target}]\n  },\n`;
    newResult += '  isDirectional: true,\n';
    newResult += '  mutations: null,\n';
    newResult += '  consequentThing: null/*{ type:\'\', name:\'\', members:[c.source,c.target],';
    newResult += 'lifeTime: 1, initialize: function(world){}}*/\n';
    newResult += '});\n\n';
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
    newResult = funcMap[data.type](data, newResult);
  });
  return newResult;
}

module.exports = structure => {
  let result = 'const SG = require(\'./src/main.js\');\n'
    + 'const world = new SG.World();\n'
    + 'const Thing = SG.Thing;\n'
    + 'const Type = SG.Type;\n'
    + 'const c = SG.constants;\n\n';

  result = compileTypes(structure.types, result);
  result = compileLocations(structure.locations, result);
  result = compileThings(structure.things, result);
  result = compileRules(structure.rules, result);
  result = compileTransitions(structure.transitions, result);

  result += 'world.runStory(4);\nconsole.log(world.output);\n';

  return result;
};
