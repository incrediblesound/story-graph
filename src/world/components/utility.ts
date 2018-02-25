import World from 'src/world/world'
import Type from 'src/components/type'
import Actor from 'src/components/actor'

export function removeActor(world: World, id: number) {
  let index: number | null = null;
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

export function getLocalSet(world: World, location) {
  return world.actors.filter(actor => actor.location === location.name);
}

export function getActor(world: World, reference: number | Type): false | Actor {
  if (reference === undefined) throw new Error('Undefined value in template.');

  if (typeof reference === 'number') {
    return world.getActorById(reference);
  }

  // this is for adding query patterns to a story, probably unnecessary
  // } else if (piece.where !== undefined) {
  //   const property = piece.where[0];
  //   const value = piece.where[1];
  //   for (let i = 0; i < world.size; i++) {
  //     if (world.actors[i][property] === value) {
  //       return world.actors[i];
  //     }
  //   }
  // }
  return false;
}

export function fetchElement(world: World, element: any): string {
  if (typeof element === 'number') {
    const actor = getActor(world, element)
    if (actor) {
      return actor.name
    }
  } else if (typeof element === 'string') {
    return element
  }
  return ''
}

