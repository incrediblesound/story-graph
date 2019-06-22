import { SOURCE, TARGET } from './constants'
import Type from './type'

export default class Actor {
  id: number
  type: Type
  name: string
  location?: string
  locations: string[]
  entryTime: number
  lifeTime: number
  // callback: () => void
  members: Actor[]
  parentId?: number;

  constructor(data, world, actorOne?: Actor, actorTwo?: Actor) {
    this.type = data.type;
    this.name = data.name;
    this.members = [];
    if (data.locations) {
      this.location = data.location || data.locations[0];
      this.locations = data.locations;
    } else {
      this.locations = [];
    }

    this.lifeTime = data.lifeTime || 999;
    // this.callback = data.callback || null;
    if (data.members) {
      this.fetchMembers(world, data.members, actorTwo, actorTwo);
    }
    if (data.initializeName) {
      this.name = data.initializeName(this, world);
    }
  }
  fetchMembers(world, members, actorOne, actorTwo) {
    members.forEach((member, idx) => {
      if (member === SOURCE) {
        this.members[idx] = actorOne
      } else if (member === TARGET) {
        this.members[idx] = actorTwo
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
