const _ = require('lodash');

module.exports = {
  removeThing,
  getLocalSet,
  getPiece
};

function removeThing(world, id) {
  var index = null;
  for (var i = 0; i < world.things.length; i++) {
    if (world.things[i].id === id) {
      index = i;
      break;
    }
  }
  if (index !== null) {
    world.things.splice(index, 1);
    world.size--;
  }
}

function getLocalSet(world, location) {
  return _.filter(world.things, (thing) => {
    return thing.location === location.name;
  });
}

function getPiece(world, piece) {
  if (piece === undefined) return;

  if (typeof piece === 'number') {
    return world.getThingById(piece);
  } else if (typeof piece === 'string') {
    return piece;
  } else if (piece.where !== undefined) {
    var property = piece.where[0];
    var value = piece.where[1];
    for (var i = 0; i < world.size; i++) {
      if (world.things[i][property] === value) {
        return world.things[i];
      }
    }
  }
}
