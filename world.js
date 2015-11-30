var _ = require('lodash');
var Type = require('./type.js');
var c = require('./constants.js');

var Rule = function(data, id){
	this.cause = data.cause;
	this.consequent = data.consequent;
	this.name = data.name;
	this.isDirectional = data.isDirectional;
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

World.prototype.addThing = function(type, name){
	var id = this.size;
	this.world.push({type: type, name: name, id: id});
	this.size++;
	return id;
}

World.prototype.runStory = function(story){
	var output = '';
	_.each(story, function(event){
		var ev = this.getEvent(event);
		output += this.processEvent(ev, event);
	}, this)
	return output;
}

World.prototype.processEvent = function(event, storyEvent){
	var cause = this.processElementValue(event.cause.value, storyEvent);
	var consequent = this.processElementValue(event.consequent.value, storyEvent);
	return cause + consequent;
}

World.prototype.processElementValue = function(element, originalElement){
	var subject = this.getActor(element[0], originalElement);
	var verb = element[1];
	var object = this.getActor(element[2], originalElement);
	
	if(object === undefined){
		return 'The '+subject.name+' '+verb+'. ';
	} else {
		return 'The '+subject.name+' '+verb+' the '+object.name+'. ';
	}
}

World.prototype.getActor = function(value, storyElement){
	if(typeof value === 'number'){
		return this.getById(value);
	}
	else if(value === c.events.source){
		return this.getById(storyElement[0])
	}
	else if(value === c.events.target){
		return this.getById(storyElement[2])
	}
}

World.prototype.getEvent = function(piece){
	var source = this.getById(piece[0]);
	var action = piece[1];
	var target = this.getById(piece[2]);
	for(var i = 0; i < this.size; i++){
		var current = this.world[i];
		if(current instanceof Rule && this.checkMatch(current, source, target, action)){
			return current;
		}
	}
}

World.prototype.checkMatch = function(current, source, target, action){
	var match;
	var ruleSource = current.getSource();
	var ruleTarget = current.getTarget();

	var sourceMatch = ruleSource instanceof Type ? contains(source.type.get(),ruleSource.get()) : ruleSource === source.id; 
	var targetMatch = ruleTarget instanceof Type ? contains(target.type.get(),ruleTarget.get()) : ruleTarget === target.id;
	if(!current.isDirectional){

		var flippedSourceMatch = ruleSource instanceof Type ? contains(target.type.get(),ruleSource.get()) : ruleSource === target.id;
		var flippedTargetMatch = ruleTarget instanceof Type ? contains(source.type.get(),ruleTarget.get()) : ruleTarget === source.id;
		
		match = (sourceMatch && targetMatch) || (flippedTargetMatch && flippedSourceMatch);
	
	} else {
	
		match = (sourceMatch && targetMatch);
	}

	return match && (current.getActionType() === action);
}

World.prototype.getById = function(id){
	for(var i = 0; i < this.size; i++){
		if(this.world[i].id === id){
			return this.world[i];
		}
	}
}

module.exports = World;

function contains(x, y){
	var result = true;
	_.each(y, function(item){
		result = result && _.contains(x, item);
	})
	return result;
}
