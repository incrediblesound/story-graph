var _ = require('lodash');
var c = require('./constants.js');

var Thing = function(data, storyEvent, world){
	this.id = null;
	this.type = data.type;
	this.name = data.name;
	this.members = data.members;
	this.lifeTime = data.lifeTime || 999;
	this.callback = data.callback || null;
	this.fetchMembers(storyEvent, world);
	if(!!data.initialize){
		data.initialize.apply(this, [storyEvent, world]);
	}
}

Thing.prototype.fetchMembers = function(storyEvent, world){
	_.each(this.members, function(member, idx){
		if(member === c.source || member === c.target){
			var member = world.getByRole(member, storyEvent);
			this.members[idx] = member;
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