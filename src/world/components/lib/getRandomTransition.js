const matchTransitionFor = require('./matchTransitionFor');

/**
 * getRandomTransition
 *   Gets a random Thing from a list of all the Things with multiple possible locations.
 *
 * @param  {World} world
 *   The world to look for things within.
 * @return {Boolean | [Transition, Thing]}
 *   A Transition and matching Thing that has more than one location.
 */
module.exports = function getRandomTransition(world) {
  const moveableSet = world.things.filter(thing => thing.locations.length > 1);
  const randomThing = moveableSet[Math.floor(Math.random() * moveableSet.length)];
  const transition = matchTransitionFor(randomThing, world.numRules, world.rules);
  return transition && [transition, randomThing];
}
