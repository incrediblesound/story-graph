import { SOURCE, TARGET } from './constants'

export default class Actor {
  constructor(data, storyEvent, world) {
    this.id = null;
    this.type = data.type;
    this.name = data.name;
    if (data.locations) {
      this.location = data.location || data.locations[0];
      this.locations = data.locations;
    } else {
      this.locations = [];
      this.location = null;
    }

    this.members = data.members;
    this.lifeTime = data.lifeTime || 999;
    this.callback = data.callback || null;
    if (storyEvent && world) {
      this.fetchMembers(storyEvent, world);
    }
    if (data.initializeName) {
      this.name = data.initializeName(this, world);
    }
  }
  fetchMembers(storyEvent, world) {
    this.members.forEach((member, idx) => {
      if (member === SOURCE) {
        this.members[idx] = world.getActorById(storyEvent[0]);
      } else if (member === TARGET) {
        this.members[idx] = world.getActorById(storyEvent[2]);
      }
    });
  }
  getTypes() {
    return this.type.get();
  }
  setEntryTime(time) {
    this.entryTime = time;
  }
}
