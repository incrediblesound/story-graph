var _ = require('lodash');
var c = require('./constants.js');

var Thing = function(data, storyEvent, world){
  this.id = null;
  this.type = data.type;
  this.name = data.name;
  if(data.locations !== undefined){
    this.location = data.location || data.locations[0];
    this.locations = data.locations;
  }

  this.members = data.members;
  this.lifeTime = data.lifeTime || 999;
  this.callback = data.callback || null;
  this.fetchMembers(storyEvent, world);
  if(!!data.initialize){
    data.initialize.apply(this, [world]);
  }
}

Thing.prototype.fetchMembers = function(storyEvent, world){
  _.each(this.members, function(member, idx){
    if(member === c.source){
      this.members[idx] = world.getThingById(storyEvent[0]);
    } else if(member === c.target){
      this.members[idx] = world.getThingById(storyEvent[2]);
    }
  }, this)
}

Thing.prototype.getTypes = function(){
  return this.type.get();
}

Thing.prototype.setEntryTime = function(time){
  this.entryTime = time;
}

module.exports = Thing;