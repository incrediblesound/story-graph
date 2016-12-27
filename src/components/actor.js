const _ = require('lodash');
const c = require('./constants.js');

module.exports = class Thing {
  constructor(data, storyEvent, world) {
    this.id = null;
    this.type = data.type;
    this.name = data.name;
    if (!!data.locations) {
      this.location = data.location || data.locations[0];
      this.locations = data.locations;
    } else {
      this.locations = [];
      this.location = null;
    }

    this.members = data.members;
    this.lifeTime = data.lifeTime || 999;
    this.callback = data.callback || null;
    this.fetchMembers(storyEvent, world);
    if (!!data.initializeName) {
      this.name = data.initializeName(this, world);
    }
  }
  fetchMembers(storyEvent, world) {
    _.each(this.members, (member, idx) => {
      if (member === c.source) {
        this.members[idx] = world.getThingById(storyEvent[0]);
      } else if (member === c.target) {
        this.members[idx] = world.getThingById(storyEvent[2]);
      }
    }, this);
  }
  getTypes() {
    return this.type.get();
  }
  setEntryTime(time) {
    this.entryTime = time;
  }
};
