const _ = require('lodash');

function simpleType(line, result) {
  const calledIdx = line.indexOf('called');
  const name = line[calledIdx + 1];
  result.types.push({
    type: 'simple',
    name,
  });
}

function thing(line, result) {
  const preDef = line.indexOf('a') > -1 ? line.indexOf('a') : line.indexOf('an');
  const calledIdx = line.indexOf('called');
  const types = line.slice(preDef + 1, calledIdx);
  let name = line[calledIdx + 1];
  name = name.replace(',', '');
  const remainder = line.slice(calledIdx + 1);
  let current;
  let theLocation;
  const locations = [];
  while (remainder.length) {
    current = remainder.shift();
    theLocation = [];
    while (!_.includes(current, '<')) {
      current = remainder.shift();
    }
    while (!_.includes(current, '>')) {
      theLocation.push(current);
      current = remainder.shift();
    }
    theLocation.push(current);
    locations.push(theLocation.join(' ').replace(/<|>/g, ''));
  }
  result.things.push({ types, name, locations });
}

function transition(line, result) {
  line.shift(); // remove the 'From'
  const first = [];
  const second = [];
  const text = [];

  let current = line.shift();
  while (!_.includes(current, '>')) {
    first.push(current);
    current = line.shift();
  }
  first.push(current);
  line.shift(); // remove the 'to'

  current = line.shift();
  while (!_.includes(current, '>')) {
    second.push(current);
    current = line.shift();
  }
  second.push(current);

  if (line[0] === 'the') { line.shift(); }

  const typeOrThing = line.shift();

  current = line.shift();
  while (!_.includes(current, '>')) {
    text.push(current);
    current = line.shift();
  }
  text.push(current);
  result.transitions.push({
    from: first.join(' ').replace(/<|>/g, ''),
    to: second.join(' ').replace(/<|>/g, ''),
    text: text.join(' ').replace(/<|>/g, ''),
    typeOrThing,
  });
}

function compoundType(line, result) {
  const referenceName = line[1];
  const baseType = line[line.length - 1];
  const addedTypes = line.slice(4, line.length - 1);
  if (!addedTypes.length) {
    result.types.push({
      type: 'compound',
      name: referenceName,
      base: baseType,
    });
  } else {
    result.types.push({
      type: 'compound',
      name: referenceName,
      base: baseType,
      additions: addedTypes,
    });
  }
}

function decorator(line, result) {
  const first = line[3];
  if (line.length === 4) {
    result.types.push({ type: 'decorator', addition: [first] });
  } else {
    const second = line[7];
    result.types.push({ type: 'decorator', addition: [first, second] });
  }
}

function location(line, result) {
  let current = line.shift();
  while (!_.includes(current, '<')) {
    current = line.shift();
  }

  const name = [];
  while (!_.includes(current, '>')) {
    name.push(current);
    current = line.shift();
  }
  name.push(current);

  result.locations.push({
    name: name.join(' ').replace(/<|>/g, ''),
  });
}

function rule(line, result) {
  let theLine = line.slice(2);
  const source = [];
  const target = [];
  const encounterText = [];
  const consequenceText = [];

  while (!_.includes(theLine[0], '<')) {
    source.push(theLine.shift());
  }

  while (!_.includes(line[0], '>')) {
    encounterText.push(theLine.shift());
  }
  encounterText.push(theLine.shift());

  theLine.shift(); // remove a or an
  const consequentA = [];
  const consequentB = [];

  while (theLine[0] !== 'then') {
    target.push(theLine.shift());
  }
  theLine = theLine.slice(2);

  while (!_.includes(theLine[0], '<')) {
    consequentA.push(theLine.shift());
  }

  while (!_.includes(theLine[0], '>')) {
    consequenceText.push(theLine.shift());
  }
  consequenceText.push(theLine.shift());

  if (theLine.length) {
    theLine.shift();
    while (theLine.length) {
      consequentB.push(theLine.shift());
    }
  }
  result.rules.push({
    source,
    target,
    consequentA,
    consequentB,
    encounterText: encounterText.join(' ').replace(/<|>/g, ''),
    consequenceText: consequenceText.join(' ').replace(/<|>/g, ''),
  });
}

function tokenizer(tokens) {
  const result = {
    types: [],
    things: [],
    rules: [],
    locations: [],
    transitions: [],
  };

  const parserMap = {
    'simple type': simpleType,
    thing,
    'compound type': compoundType,
    decorator,
    location,
    rule,
    transition,
  };
  _.each(tokens, tok => {
    parserMap[tok.type](tok.line, result);
  });

  return result;
}

module.exports = tokenizer;
