export function removeActor(world, id) {
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

export function getLocalSet(world, location) {
  return world.actors.filter(actor => actor.location === location.name);
}

export function getPiece(world, piece) {
  if (piece === undefined) throw new Error('Undefined value in template.');

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
