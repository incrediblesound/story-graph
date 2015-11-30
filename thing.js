var Thing = function(data){
	this.id = null;
	this.type = data.type;
	this.name = data.name;
	this.lifeTime = data.lifeTime || 999;
	this.callback = data.callback || null;
}

Thing.prototype.getTypes = function(){
	return this.type.get();
}

Thing.prototype.setEntryTime = function(time){
	this.entryTime = time;
}

module.exports = Thing;