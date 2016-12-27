const _ = require('lodash');

function isATypeOrActor(line) {
  return (
    line[0] === 'There' &&
    line[1] === 'is' &&
    (line[2] === 'a' || line[2] === 'an')
  );
}

function isATransition(line) {
  return (
    line[0] === 'From' &&
    _.includes(line, 'to')
  );
}

function isACompondType(line) {
  return (
    (line[0] === 'A' || line[0] === 'An') &&
    line[2] === 'is' &&
    (line[3] === 'a' || line[3] === 'an')
  );
}

function isATypeDecorator(line) {
  return (
    line[0] === 'Some' &&
    line[1] === 'actors'
  );
}

function isARuleDefinition(line) {
  return (
    line[0] === 'If' &&
    (line[1] === 'a' || line[1] === 'an') &&
    _.includes(line, 'then')
  );
}

function isATypeDefinition(line) {
  return (
    line[3] === 'type'
  );
}

function isAPlaceDefinition(line) {
  return (
    line[3] === 'place'
  );
}

function tokenizer(body) {
  const tokens = [];
  const theBody = body.split('.');
  _.each(theBody, line => {
    const theLine = _.compact(line.split(/\s/));
    if (!theLine.length) return;
    if (isATypeOrActor(theLine)) {
      if (isATypeDefinition(theLine)) {
        tokens.push({
          type: 'simple type',
          line: theLine,
        });
      } else if (isAPlaceDefinition(theLine)) {
        tokens.push({
          type: 'location',
          line: theLine,
        });
      } else {
        tokens.push({ type: 'actor', line: theLine });
      }
    } else if (isATransition(theLine)) {
      tokens.push({ type: 'transition', line: theLine });
    } else if (isACompondType(theLine)) {
      tokens.push({ type: 'compound type', line: theLine });
    } else if (isATypeDecorator(theLine)) {
      tokens.push({ type: 'decorator', line: theLine });
    } else if (isARuleDefinition(theLine)) {
      tokens.push({ type: 'rule', line: theLine });
    } else {
      process.stdout.write(`Error: no match for line \"${line}\".\n`);
    }
  });
  return tokens;
}

module.exports = tokenizer;
