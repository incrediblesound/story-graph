var _ = require('lodash');

var Rule = function(data, id){
	this.id = id;
	this.cause = data.cause;
	this.consequent = data.consequent;
	this.consequentThing = data.consequentThing;
	this.name = data.name;
	this.isDirectional = data.isDirectional;
}

Rule.prototype.getSource = function(){
	return this.cause.type[0];
}

Rule.prototype.getTarget = function(){
	return this.cause.type[2];
}

Rule.prototype.getActionType = function(){
	return this.cause.type[1];
}

module.exports = Rule;