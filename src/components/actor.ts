import { SOURCE, TARGET } from './constants'
import Type from './type'
import Location from './location'

export default class Actor {
  id: number
  type: Type
  name: string
  location: string | null
  locations: string[]
  entryTime: number
  lifeTime: number
  // callback: () => void
  members: Actor[]
  parentId?: number;

  constructor(data, storyEvent, world) {
    this.type = data.type;
    this.name = data.name;
    this.members = [];
    if (data.locations) {
      this.location = data.location || data.locations[0];
      this.locations = data.locations;
    } else {
      this.locations = [];
      this.location = null;
    }

    this.lifeTime = data.lifeTime || 999;
    // this.callback = data.callback || null;
    if (storyEvent && world) {
      this.fetchMembers(storyEvent, world, data.members);
    }
    if (data.initializeName) {
      this.name = data.initializeName(this, world);
    }
  }
  fetchMembers(storyEvent, world, members) {
    members.forEach((member, idx) => {
      if (member === SOURCE) {
        this.members[idx] = world.getActorById(storyEvent[0]);
      } else if (member === TARGET) {
        this.members[idx] = world.getActorById(storyEvent[2]);
      }
    });
  }
  hasMember(id: number): boolean {
    let found: boolean = false;
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].id === id) {
        found = true
        break
      }
    }
    return found
  }
  getTypes() {
    return this.type.get();
  }
  setEntryTime(time) {
    this.entryTime = time;
  }
}
