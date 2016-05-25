const _ = require('lodash');
const utility = require('./utility.js');

module.exports = {
  advance,
  processTimeTrigger
};

function advance(world) {
  if (world.timedEvents[world.timeIndex] !== undefined) {
    world.renderEvent([world.timedEvents[world.timeIndex]]);
  } else {
    world.randomEvent();
  }
  world.things.forEach((thing, idx) => {
    if (idx >= world.size) return;
    const age = world.timeIndex - thing.entryTime;
    if (age > thing.lifeTime) {
      utility.removeThing(world, thing.id);
    }
    else if (thing.callback !== null) {
      world.processTimeTrigger(world, thing.callback(world.timeIndex));
    }
  });
  world.timeIndex++;
}

function processTimeTrigger(world, timeEvent) {
    // do smth
}
