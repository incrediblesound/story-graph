var _ = require('lodash');

module.exports = function (structure) {
  var result = 'const SG = require(\'./src/main.js\');\n'
              + 'const world = new SG.World();\n'
              + 'const Thing = SG.Thing;\n'
              + 'const Type = SG.Type;\n'
              + 'const c = SG.constants;\n';
  result = compileTypes(structure.types, result);
  result = compileLocations(structure.locations, result);
  result = compileThings(structure.things, result);
  result = compileRules(structure.rules, result);
  result = compileTransitions(structure.transitions, result);

  result += 'world.runStory(4);\n console.log(world.output);\n';
  return result;
};

// compile all the types
function compileTypes(types, result) {
  const funcMap = {
    simple: writeSimpleType,
    compound: writeCompoundType,
    decorator: writeTypeDecorator,
  };
  _.each(types, (data) => {
    result = funcMap[data.type](data, result);
  });
  return result;
}

function writeSimpleType(data, result) {
  result += ` var ${data.name} = new Type(\'${data.name}\')\n`;
  return result;
}

function writeCompoundType(data, result) {
  var typeExpression = `${data.base}.extend('${data.name}')`;
  if (data.additions) {
    data.additions.forEach((decorator) => {
      typeExpression = `${decorator}(${typeExpression})`;
    });
  }
  result += 'var ' + data.name + ' = ';
  result += typeExpression + ';\n\n';
  return result;
}

function writeTypeDecorator(data, result) {
  _.each(data.addition, function (value) {
    result += 'var ' + value + ' = function(type){\n';
    result += '\treturn type.extend(\'' + value + '\');\n}\n\n';
  });
  return result;
}

// compile locations
function compileLocations(data, result) {
  let newResult = result;
  _.each(data, (location) => {
    newResult += `world.addLocation({ name: \'${location.name}\' });\n\n`;
  });
  return newResult;
}

// compile transitions
function compileTransitions(data, result) {
  let nextResult = result;
  _.each(data, (transition) => {
    nextResult += 'world.addRule({\n';
    nextResult += '\tcause: {\n';
    nextResult += `\t\ttype: [${transition.typeOrThing}, c.move_out, \'${transition.from}\'],\n`;
    nextResult += '\t\tvalue: [\'\']\n\t},\n';
    nextResult += '\tconsequent: {\n';
    nextResult += `\t\ttype: [c.source, c.move_in, \'${transition.to}\'],\n`;
    nextResult += `\t\tvalue: [c.source, \'${transition.text}\', \'${transition.to}\']\n\t},\n`;
    nextResult += '\tisDirectional: true,\n';
    nextResult += '\tmutations: null,\n';
    nextResult += '\tconsequentThing: null\n';
    nextResult += '})\n\n';
  });
  return nextResult;
}

// compile all the things
function compileThings(things, result) {
  let newResult = result;
  _.each(things, function (data) {
    newResult += `var ${data.name} = new Thing({`;
    newResult += `type: ${processTypes(data.types)}
                  , name: \'${data.name}\'
                  , locations: ${JSON.stringify(data.locations)}
                  })\n`;
    newResult += `var ${data.name} = world.addThing(${data.name})\n\n`;
  });
  return newResult;
}

// compile all the rules
function compileRules(rules, result) {
  _.each(rules, function (rule) {
    result += 'world.addRule({\n';
    result += '\tcause: {\n';
    result += '\t\ttype: [' + processTypes(rule.source.slice()) + ', c.encounter, ' +
                   processTypes(rule.target.slice()) + '],\n';
    result += '\t\tvalue: [c.source, \'' + rule.encounterText + '\', c.target]\n\t},\n';
    result += '\tconsequent: {\n';
    result += '\t\ttype: [],\n';
    const source = matchEntity(rule.consequentA, rule, 'c.source');
    const target = matchEntity(rule.consequentB, rule, 'c.target');
    result += '\t\tvalue: [' + source + ', \'' + rule.consequenceText + '\'' + target + ']\n\t},\n';
    result += '\tisDirectional: true,\n';
    result += '\tmutations: null,\n';
    result += '\tconsequentThing: null/*{ type:\'\', name:\'\', members:[c.source,c.target],';
    result += 'lifeTime: 1, initialize: function(world){}}*/\n';
    result += '})\n\n';
  });

  return result;

  function matchEntity(data, rule, position) {
    var result;
    if (!data.length) {
      return '';
    }
    if (isEqual(data, rule.source) && isEqual(data, rule.target)) {
      result = position;
    }
    else if (isEqual(data, rule.source)) {
      result = 'c.source';
    } else {
      result = 'c.target';
    }

    if (position === 'c.target') { result = `, ${result}`; }

    return result;
  }
}

// helper for printing type decorators
function processTypes(types) {
  let result = '';
  let tail = '';
  while (types.length > 1) {
    const current = types.shift();
    result += current + '(';
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
