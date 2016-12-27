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

function twoActors(world) {
  const actorOne = world.actors[Math.floor(Math.random() * world.actors.length)];
  const localActors = world.actors.filter((actor) =>
    (actor.location === actorOne.location) && (actor.name !== actorOne.name)
  );
  if (!localActors.length) {
    return false;
  }
  const actorTwo = localActors[Math.floor(Math.random() * localActors.length)];
  return [actorOne, actorTwo];
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
    && _.find(target.members, { id: source.id }).length;
  const targetInSource = !(target === undefined) && !!source.members
    && _.find(source.members, { id: target.id }).length;

  if (action !== undefined) {
    return match
      && (rule.getActionType() === action)
      && !(sourceInTarget || targetInSource);
  }
  return match && !(sourceInTarget || targetInSource);
}

function matchRuleFor(world, one, two, action) {
  const matchedRules = [];
  // create a list of rules that either have no location limitation or whose location
  // limitations contain the location of the two actor one && two.
  const localRules = world.rules.filter((rule) => {
    const hasLocation = !!rule.locations.length;
    if (!hasLocation || !one.location) return true;
    return one.location && (!hasLocation || _.includes(rule.locations, one.location));
  });
  for (let i = 0; i < localRules.length; i++) {
    const isMatch = checkMatch(localRules[i], one, two, action);
    if (isMatch) {
      matchedRules.push(localRules[i]);
    }
  }
  if (!matchedRules.length) {
    return false;
  }
  return matchedRules[Math.floor(Math.random() * matchedRules.length)];
}

function randomMatch(world) {
  // this function checks the random result of rollDie()
  // to occasionally render a location transition
  if (world.numLocations && rollDie() < 2) {
    const randomTransition = getRandomTransition(world);
    return randomTransition;
  }
  const pair = twoActors(world);
  if (!pair) {
    return false;
  }
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
  twoActors,
  randomMatch,
};
