const matchTransitionFor = require('./matchTransitionFor');

module.exports = function getRandomTransition(world) {
  const moveableSet = world.things.filter(thing => thing.locations.length > 1);
  const randomThing = moveableSet[Math.floor(Math.random() * moveableSet.length)];
  return randomThing && [matchTransitionFor(randomThing, world.numRules, world.rules), randomThing];
}
