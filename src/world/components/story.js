import { ENCOUNTER } from '../../components/constants.js'
import Type from '../../components/type.js'
import getRandomTransition from './lib/getRandomTransition'
import { find, includes } from 'lodash'

/* HELPERS */

function isSubset(set, subset) {
  return subset.reduce((acc, curr) => acc && (set.indexOf(curr) !== -1), true)
}

function rollDie() {
  return Math.floor(Math.random() * 7);
}

/* MAIN FUNCTIONS */

export function twoActors(world) {
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

export function checkMatch(rule, source, target, action) {
  let match;
  const ruleSource = rule.getSource();
  const ruleTarget = rule.getTarget();

  const sourceMatch = ruleSource instanceof Type
    ? isSubset(source.getTypes(), ruleSource.get())
    : ruleSource === source.id;

  const targetMatch = (target === undefined)
    || (ruleTarget instanceof Type
      ? isSubset(target.getTypes(), ruleTarget.get())
      : ruleTarget === target.id);

  if (!rule.isDirectional && target !== undefined) {
    const flippedSourceMatch = ruleSource instanceof Type
      ? isSubset(target.getTypes(), ruleSource.get())
      : ruleSource === target.id;
    const flippedTargetMatch = ruleTarget instanceof Type
      ? isSubset(source.getTypes(), ruleTarget.get())
      : ruleTarget === source.id;
    match = (sourceMatch && targetMatch) || (flippedTargetMatch && flippedSourceMatch);
  } else { match = (sourceMatch && targetMatch); }

  const sourceInTarget = !(target === undefined) && !!target.members
    && find(target.members, { id: source.id }).length;
  const targetInSource = !(target === undefined) && !!source.members
    && find(source.members, { id: target.id }).length;

  if (action !== undefined) {
    return match
      && (rule.getActionType() === action)
      && !(sourceInTarget || targetInSource);
  }
  return match && !(sourceInTarget || targetInSource);
}

export function matchRuleFor(world, one, two, action) {
  const matchedRules = [];
  // create a list of rules that either have no location limitation or whose location
  // limitations contain the location of the two actor one && two.
  const localRules = world.rules.filter((rule) => {
    const hasLocation = !!rule.locations.length;
    if (!hasLocation || !one.location) return true;
    return one.location && (!hasLocation || includes(rule.locations, one.location));
  });
  for (let i = 0; i < localRules.length; i++) {
    const currentRule = localRules[i];
    const isMatch = checkMatch(currentRule, one, two, action);
    if (isMatch) {
      matchedRules.push(currentRule);
    }
  }
  if (!matchedRules.length) {
    return false;
  }
  return matchedRules[Math.floor(Math.random() * matchedRules.length)];
}

export function randomMatch(world) {
  // this function checks the random result of rollDie()
  // to occasionally render a location transition
  if (world.numLocations && rollDie() < 2) {
    const randomTransition = getRandomTransition(world);
    return randomTransition;
  }
  const pair = twoActors(world);
  if (!pair) return false;
  const [one, two] = pair;

  const rule = matchRuleFor(world, one, two, ENCOUNTER);
  if (!rule) {
    return false;
  }
  return [rule, one, two];
}
