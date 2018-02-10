
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
  data.addition.forEach(value => {
    newResult += `const ${value} = function(type) {\n`;
    newResult += ` return type.extend(\'${value}\');\n}\n\n`;
  });
  return newResult;
}

// compile locations
function compileLocations(data, result) {
  let newResult = result;
  data.forEach(location => {
    newResult += `world.addLocation({ name: \'${location.name}\' });\n\n`;
  });
  return newResult;
}

// compile transitions
function compileTransitions(data, result) {
  let newResult = result;
  data.forEach(transition => {
    newResult +=
      `
      world.addRule({
      cause: {
        type: [${transition.typeOrActor}, c.MOVE_OUT, \'${transition.from}\'],
        template: [\'\']\n  },
      consequent: {
        type: [c.SOURCE, c.MOVE_IN, \'${transition.to}\'],
        template: [c.SOURCE, \'${transition.text}\', \'${transition.to}\']\n  },
      isDirectional: true,
      mutations: null,
      consequentActor: null
      });
      `
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
  a.forEach((val, i) => {
    result = result && (val === b[i]);
  });
  return result;
}

// compile all the actors
function compileActors(actors, result: string) {
  actors.forEach(data => {
    result +=
      `
      const ${data.name} = world.addActor(
        new Actor({
          type: ${processTypes(data.types)},
          name: '${data.name}',
          locations: ['${data.locations.join('\', \'')}']
      }));
      `
  });
  return result;
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
      newResult = 'c.SOURCE';
    } else {
      newResult = 'c.TARGET';
    }

    if (position === 'c.TARGET') {
      newResult = `, ${newResult}`;
    }
    return newResult;
  }

  let newResult = result;

  rules.forEach(rule => {
    const source = matchEntity(rule.consequentA, rule, 'c.SOURCE');
    const target = matchEntity(rule.consequentB, rule, 'c.TARGET');
    newResult +=
      `
      world.addRule({
      cause: {
        type: [${processTypes(rule.source.slice())}, c.ENCOUNTER, ${processTypes(rule.target.slice())}],
        template: [c.SOURCE, '${rule.encounterText}', c.TARGET]
      },
      consequent: {
        type: [],
        template: [${source}, \'${rule.consequenceText}\'${target}]
      },
        isDirectional: true,
        mutations: null,
        consequentActor: null/*{ type:\'\', name:\'\', members:[c.SOURCE,c.TARGET],lifeTime: 1, initialize: function(world){}}*/
      });
      `
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
  types.forEach(data => {
    newResult = funcMap[data.type](data, newResult);
  });
  return newResult
}

const compiler = structure => {
  let result =
    `
    const SG = require(\'./dist/story.js\');
    const world = new SG.World();
    const Actor = SG.Actor;
    const Type = SG.Type;
    const c = SG.constants;
    `

  result = compileTypes(structure.types, result);
  result = compileLocations(structure.locations, result);
  result = compileActors(structure.actors, result);
  result = compileRules(structure.rules, result);
  result = compileTransitions(structure.transitions, result);

  result += 'world.runStory(4);\nconsole.log(world.output);\n';

  return result;
};

export default compiler
