var Thing = function(data, storyEvent, world){
	this.id = null;
	this.type = data.type;
	this.name = data.name;
	this.lifeTime = data.lifeTime || 999;
	this.callback = data.callback || null;
	if(!!data.initialize){
		data.initialize.apply(this, [storyEvent, world]);
	}
}

Thing.prototype.getTypes = function(){
	return this.type.get();
}

Thing.prototype.setEntryTime = function(time){
	this.entryTime = time;
}

module.exports = Thing;