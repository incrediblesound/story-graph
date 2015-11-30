var _ = require('lodash');

var Rule = function(data, id){
	this.cause = data.cause;
	this.consequent = data.consequent;
	this.name = data.name;
	this.id = id;
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

var World = function(){
	this.size = 0;
	this.world = [];
}

World.prototype.addRule = function(data){
	var id = this.size;
	var rule = new Rule(data, id);
	this.world.push(rule);
	this.size++;
	return id;
}

World.prototype.addThing = function(thing){
	var id = this.size;
	this.world.push({id: id, name: thing});
	this.size++;
	return id;
}

World.prototype.runStory = function(story){
	var output = '';
	_.each(story, function(event){
		var ev = this.getEvent(event);
		output += this.processEvent(ev);
	}, this)
	return output;
}

World.prototype.processEvent = function(event){
	var cause = this.processElementValue(event.cause.value);
	var consequent = this.processElementValue(event.consequent.value);
	return cause + consequent;
}

World.prototype.processElementValue = function(element){
	var subject = this.getById(element[0]);
	var verb = element[1];
	var object = this.getById(element[2]);
	if(object === undefined){
		return 'The '+subject.name+' '+verb+'. ';
	} else {
		return 'The '+subject.name+' '+verb+' the '+object.name+'. ';
	}
}


World.prototype.getEvent = function(piece){
	var source = piece[0];
	var action = piece[1];
	var target = piece[2];
	for(var i = 0; i < this.size; i++){
		var current = this.world[i];
		if( current instanceof Rule &&
		   ((current.getSource() === source && 
		   	 current.getTarget() === target) || 
		    (current.getSource() === target && 
		     current.getTarget() === source)) 
		     && current.getActionType() === action){
			return current;
		}
	}
}

World.prototype.getById = function(id){
	for(var i = 0; i < this.size; i++){
		if(this.world[i].id === id){
			return this.world[i];
		}
	}
}
module.exports = World;
