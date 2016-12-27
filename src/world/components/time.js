const utility = require('./utility.js');

function advance(world) {
  if (world.timedEvents[world.timeIndex] !== undefined) {
    world.renderEvent([world.timedEvents[world.timeIndex]]);
  } else {
    world.randomEvent();
  }
  world.actors.forEach((actor, idx) => {
    if (idx >= world.size) return;
    const age = world.timeIndex - actor.entryTime;
    if (age > actor.lifeTime) {
      utility.removeActor(world, actor.id);
    } else if (actor.callback !== null) {
      world.processTimeTrigger(world, actor.callback(world.timeIndex));
    }
  });
  world.timeIndex++;
}

// function processTimeTrigger(world, timeEvent) {}

module.exports = {
  advance,
  // processTimeTrigger,
};
