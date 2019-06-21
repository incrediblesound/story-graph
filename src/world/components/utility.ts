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

export function fetchElement(world: World, element: any): string {
  if (typeof element === 'number') {
    const actor = world.getActorById(element)
    if (actor) {
      return actor.name
    }
  } else if (typeof element === 'string') {
    return element
  }
  return ''
}

