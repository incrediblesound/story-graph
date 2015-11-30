var Thing = function(data){
	this.name = data.name;
	this.actions = data.actions || null;
}

Thing.prototype.setActions = function(data){
	this.actions = data;
}

module.exports = Thing;