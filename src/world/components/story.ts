import { Event } from '../../components/constants'
import getRandomTransition from './lib/getRandomTransition'
import Actor from '../../components/actor'
import Rule from '../../components/rule'
import World from '../../world/world'
import Type from '../../components/type'

import ruleMatchesActor from './lib/ruleMatchesActor'
import getLocalRules from './lib/getLocalRules';

/* HELPERS */

function rollDie(): number {
  return Math.floor(Math.random() * 7)
}

/* MAIN FUNCTIONS */

const sameLocation = (one: Actor, two: Actor): boolean => one.location === two.location;
const sameName = (one: Actor, two: Actor): boolean => one.name === two.name;

export function twoActors(world: World, actor?: Actor): Actor[] {
  const actorOne: Actor = actor || world.actors[Math.floor(Math.random() * world.actors.length)];
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
): boolean {
  let match;
  const sourceMatch = ruleMatchesActor(rule, source, 'source')
  const targetMatch = ruleMatchesActor(rule, target, 'target');

  if (!rule.isDirectional && target !== undefined) {

    const flippedSourceMatch = ruleMatchesActor(rule, target, 'source');
    const flippedTargetMatch = ruleMatchesActor(rule, source, 'target');

    match = (sourceMatch && targetMatch) || (flippedTargetMatch && flippedSourceMatch);

  } else { match = (sourceMatch && targetMatch); }

  /* this code assumes that actors cannot interact with rule that they are a member of.
  I think this may be incorrect so I am commenting it out for now

  const sourceInTarget = !!target && target.members && target.hasMember(source.id);
  const targetInSource = !!target && source.members && source.hasMember(target.id);
  */

  if (action !== undefined) {
    return match && rule.getActionType() === action
      /* && !(sourceInTarget || targetInSource); */
  }

  return match /* && !(sourceInTarget || targetInSource); */
}

export function matchRuleFor(
  world: World, 
  actorOne: Actor, 
  actorTwo: Actor | undefined, 
  action?: Event
) {
  const matchedRules: Rule[] = [];

  const localRules = getLocalRules(world, actorOne);

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
