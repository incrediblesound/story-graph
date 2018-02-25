// import matchTransitionFor from './matchTransitionFor'
import checkTransitionMatch from './checkTransitionMatch'
import Actor from '../../../components/actor'
import Rule from '../../../components/rule'

/**
 * getRandomTransition
 *   Gets a random Actor from a list of all the Actors with multiple possible locations.
 *
 * @param  {World} world
 *   The world to look for actors within.
 * @return {Boolean | [Transition, Actor]}
 *   A Transition and matching Actor that has more than one location.
 */
const getRandomTransition = (world, actor: Actor): false | [ Rule, Actor ] => {
  const moveableSet = world.actors.filter(actor => actor.locations.length > 1);
  if (!moveableSet.length) {
    throw new Error(
      'You have defined transitions but none of your actors have multiple possible locations.'
    );
  }
  const matchedRules = world.rules.filter(rule => checkTransitionMatch(rule, actor));
  return matchedRules;
};

export default getRandomTransition
