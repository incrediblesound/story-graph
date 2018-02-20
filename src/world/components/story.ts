import { ENCOUNTER, REST, Event } from '../../components/constants'
import Type from '../../components/type'
import getRandomTransition from './lib/getRandomTransition'
import Actor from '../../components/actor'
import Rule from '../../components/rule'
import World from '../../world/world'

/* HELPERS */

function isSubset(set, subset) {
  return subset.reduce((acc, curr) => acc && (set.indexOf(curr) !== -1), true)
}

function rollDie(): number {
  return Math.floor(Math.random() * 7)
}

function includes(arr: any[], item: any) {
  return arr.indexOf(item) !== -1
}

/* MAIN FUNCTIONS */

const sameLocation = (one: Actor, two: Actor): boolean => one.location === two.location;
const sameName = (one: Actor, two: Actor): boolean => one.name === two.name;

export function twoActors(world: World): Actor[] {
  const actorOne: Actor = world.actors[Math.floor(Math.random() * world.actors.length)];
  let localActors: Actor[];
  if (actorOne.location) {
    localActors = world.actors.filter(actor => sameLocation(actor, actorOne) && !sameName(actor, actorOne))
  } else {
    localActors = world.actors.filter(actor => !sameName(actor, actorOne));
  }
  if (!localActors.length) {
    return [ actorOne ];
  }
  const actorTwo: Actor = localActors[Math.floor(Math.random() * localActors.length)];
  return [ actorOne, actorTwo ];
}

export function checkMatch(
    rule: Rule, 
    source: Actor, 
    target: Actor | undefined, 
    action?: Event
) {
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

  const sourceInTarget = !!target && target.members && target.hasMember(source.id);
  const targetInSource = !!target && source.members && source.hasMember(target.id);

  if (action !== undefined) {
    return match
      && (rule.getActionType() === action)
      && !(sourceInTarget || targetInSource);
  }
  return match && !(sourceInTarget || targetInSource);
}

export function matchRuleFor(world: World, actorOne: Actor, actorTwo: Actor | undefined, action?: Event) {
  const matchedRules: Rule[] = [];

  // create a list of rules that either have no location limitation or whose location
  // limitations contain the location of the two actors
  const localRules: Rule[] = world.rules.filter((rule: Rule) => {
    const hasLocation = !!rule.locations.length;
    // rule is universal or actorOne is omnipresent
    if (!hasLocation || !actorOne.location) return true;

    return actorOne.location && (!hasLocation || includes(rule.locations, actorOne.location));
  });

  for (let i = 0; i < localRules.length; i++) {
    const currentRule = localRules[i];
    const isMatch = checkMatch(currentRule, actorOne, actorTwo, action);
    if (isMatch) {
      matchedRules.push(currentRule);
    }
  }
  if (!matchedRules.length) {
    return false;
  }
  return matchedRules[Math.floor(Math.random() * matchedRules.length)];
}

export function randomMatch(world: World): false | [ Rule, Actor, Actor ] | [ Rule, Actor ] {
  // this function checks the random result of rollDie()
  // to occasionally render a location transition
  if (world.numLocations && rollDie() < 2) {
    const randomTransition = getRandomTransition(world);
    return randomTransition;
  }
  const pair = twoActors(world);

  const [ actorOne, actorTwo ] = pair;

  const rule = matchRuleFor(world, actorOne, actorTwo)

  if (!rule) {
    return false;
  } else if (!actorTwo) {
    return [ rule, actorOne ]
  } else {
    return [ rule, actorOne, actorTwo ];    
  }
}
