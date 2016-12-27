const matchTransitionFor = require('./matchTransitionFor');

/**
 * getRandomTransition
 *   Gets a random Actor from a list of all the Actors with multiple possible locations.
 *
 * @param  {World} world
 *   The world to look for actors within.
 * @return {Boolean | [Transition, Actor]}
 *   A Transition and matching Actor that has more than one location.
 */
module.exports = function getRandomTransition(world) {
  const moveableSet = world.actors.filter(actor => actor.locations.length > 1);
  const randomActor = moveableSet[Math.floor(Math.random() * moveableSet.length)];
  const transition = matchTransitionFor(randomActor, world.numRules, world.rules);
  return transition && [transition, randomActor];
};
