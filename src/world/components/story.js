const utility = require('./utility.js');
const c = require('../../components/constants.js');
const Type = require('../../components/type.js');
const getRandomTransition = require('./lib/getRandomTransition');
const _ = require('lodash');

// special contains for dealing with types
// returns true if all of y are in x
function contains(x, y) {
  let result = true;
  _.each(y, item => {
    result = result && _.includes(x, item);
  });
  return result;
}

function twoThings(world) {
  let localSet = [];
  let randomLocation;
  if (world.numLocations) {
    while (localSet.length < 2) {
      randomLocation = world.locations[Math.floor(Math.random() * world.numLocations)];
      localSet = utility.getLocalSet(world, randomLocation);
    }
  } else {
    localSet = world.things.slice();
  }
  const thingOne = _.first(localSet.splice(Math.floor(Math.random() * localSet.length), 1));
  const thingTwo = _.first(localSet.splice(Math.floor(Math.random() * localSet.length), 1));
  return [thingOne, thingTwo];
}

function rollDie() {
  return Math.floor(Math.random() * 7);
}


function checkMatch(rule, source, target, action) {
  let match;
  const ruleSource = rule.getSource();
  const ruleTarget = rule.getTarget();

  const sourceMatch = ruleSource instanceof Type
    ? contains(source.getTypes(), ruleSource.get())
    : ruleSource === source.id;
  const targetMatch = (target === undefined)
    || (ruleTarget instanceof Type
      ? contains(target.getTypes(), ruleTarget.get())
      : ruleTarget === target.id);

  if (!rule.isDirectional && target !== undefined) {
    const flippedSourceMatch = ruleSource instanceof Type
      ? contains(target.getTypes(), ruleSource.get())
      : ruleSource === target.id;
    const flippedTargetMatch = ruleTarget instanceof Type
      ? contains(source.getTypes(), ruleTarget.get())
      : ruleTarget === source.id;
    match = (sourceMatch && targetMatch) || (flippedTargetMatch && flippedSourceMatch);
  } else { match = (sourceMatch && targetMatch); }

  const sourceInTarget = !(target === undefined) && !!target.members
    && _.where(target.members, { id: source.id }).length;
  const targetInSource = !(target === undefined) && !!source.members
    && _.where(source.members, { id: target.id }).length;

  if (action !== undefined) {
    return match && (rule.getActionType() === action) && !(sourceInTarget || targetInSource);
  }
  return match && !(sourceInTarget || targetInSource);
}

function matchRuleFor(world, one, two, action) {
  const rules = [];
  for (let i = 0; i < world.numRules; i++) {
    const isMatch = checkMatch(world.rules[i], one, two, action);
    if (isMatch) {
      rules.push(world.rules[i]);
    }
  }
  if (!rules.length) {
    return false;
  }
  return rules[Math.floor(Math.random() * rules.length)];
}

function randomMatch(world) {
  if (world.numLocations && rollDie() < 1) {
    return getRandomTransition(world);
  }
  const pair = twoThings(world);
  const one = pair[0];
  const two = pair[1];
  const rule = matchRuleFor(world, one, two, c.encounter);
  if (!rule) {
    return false;
  }
  return [rule, one, two];
}

module.exports = {
  checkMatch,
  matchRuleFor,
  twoThings,
  randomMatch,
};
