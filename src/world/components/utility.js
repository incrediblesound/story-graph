const _ = require('lodash');

function removeActor(world, id) {
  let index = null;
  for (let i = 0; i < world.actors.length; i++) {
    if (world.actors[i].id === id) {
      index = i;
      break;
    }
  }
  if (index !== null) {
    world.actors.splice(index, 1);
    world.size--;
  }
}

function getLocalSet(world, location) {
  return _.filter(world.actors, (actor) => actor.location === location.name);
}

function getPiece(world, piece) {
  if (piece === undefined) return false;

  if (typeof piece === 'number') {
    return world.getActorById(piece);
  } else if (typeof piece === 'string') {
    return piece;
  } else if (piece.where !== undefined) {
    const property = piece.where[0];
    const value = piece.where[1];
    for (let i = 0; i < world.size; i++) {
      if (world.actors[i][property] === value) {
        return world.actors[i];
      }
    }
  }
  return false;
}

module.exports = {
  removeActor,
  getLocalSet,
  getPiece,
};
