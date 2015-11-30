var _ = require('lodash');
var Type = require('./type.js');
var Thing = require('./things.js');
var c = require('./constants.js');
var Rule = require('./rule.js');

var World = function(){
	this.size = 0;
	this.world = [];

	this.numRules = 0;
	this.rules = [];

	this.timeIndex = 0;
}

World.prototype.advance = function(){
	this.timeIndex++;
	_.each(this.world, function(thing, idx){
		if((this.timeIndex - thing.entryTime) >= thing.lifeTime){
			this.removeThing(idx);
		} 
		else if(thing.callback !== null){
			this.processTimeTrigger(thing.callback(this.timeIndex));
		}
	})
}

World.prototype.processTimeTrigger = function(timeEvent){
	//do smth
}

World.prototype.removeThing = function(idx){
	this.world = this.world.slice(0, idx).concat(this.world.slice(idx+1, this.size));
}

World.prototype.addRule = function(data){
	var id = this.numRules;
	var rule = new Rule(data, id);
	this.rules.push(rule);
	this.numRules++;
	return id;
}

World.prototype.addThing = function(thing){
	var id = this.size;
	thing.id = id;
	thing.setEntryTime(this.timeIndex);
	this.world.push(thing);
	this.size++;
	return id;
}

/*
 * Main run story function
 */
World.prototype.runStory = function(story){
	var output = '';
	_.each(story, function(storyEvent){
		var rule = this.findRule(storyEvent);
		output += this.processEvent(rule, storyEvent);
		this.advance();
	}, this)
	return output;
}

World.prototype.processEvent = function(rule, storyEvent){
	var cause = this.processElementValue(rule.cause.value, storyEvent);
	var consequent = this.processElementValue(rule.consequent.value, storyEvent);
	if(!!rule.consequentThing){
		this.addThing(rule.consequentThing);
	}
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
		return this.getPiece(storyElement[0])
	}
	else if(value === c.events.target){
		return this.getPiece(storyElement[2])
	}
}

World.prototype.findRule = function(piece){
	var source = this.getPiece(piece[0]);
	var action = piece[1];
	var target = this.getPiece(piece[2]);
	for(var i = 0; i < this.numRules; i++){
		var current = this.rules[i];
		if(this.checkMatch(current, source, target, action)){
			return current;
		}
	}
}

World.prototype.getPiece = function(piece){
	if(typeof piece === 'number'){
		return this.getById(piece);
	} else {
		var property = piece.where[0];
		var value = piece.where[1];
		for(var i = 0; i < this.size; i++){
			if(this.world[i][property] === value){
				return this.world[i];
			}
		}
	}
}

World.prototype.checkMatch = function(current, source, target, action){
	var match;
	var ruleSource = current.getSource();
	var ruleTarget = current.getTarget();

	var sourceMatch = ruleSource instanceof Type ? contains(source.getTypes(),ruleSource.get()) : ruleSource === source.id; 
	var targetMatch = ruleTarget instanceof Type ? contains(target.getTypes(),ruleTarget.get()) : ruleTarget === target.id;
	if(!current.isDirectional){

		var flippedSourceMatch = ruleSource instanceof Type ? contains(target.getTypes(),ruleSource.get()) : ruleSource === target.id;
		var flippedTargetMatch = ruleTarget instanceof Type ? contains(source.getTypes(),ruleTarget.get()) : ruleTarget === source.id;
		
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
