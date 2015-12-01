var _ = require('lodash');
var Type = require('./type.js');
var Thing = require('./thing.js');
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
	if(Array.isArray(thing)){
		_.each(thing, function(item){
			add.apply(this, [item]);
		}, this)
	} else {
		add.apply(this, [thing])
	}

	function add(thing, self){
		var id = this.size;
		thing.id = id;
		thing.setEntryTime(this.timeIndex);
		this.world.push(thing);
		this.size++;
		return id;
	}
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

World.prototype.makeStory = function(time){
	var output = ''
	while(time > this.timeIndex){
		var nextEvent = [], counter = 0;
		while(nextEvent[0] === undefined){
			counter++;
			if(counter > 100) {throw new Error('Couldn\'t find match')}
			nextEvent = this.randomMatch();
		}
		var rule = nextEvent[0];
		var one = nextEvent[1];
		var two = nextEvent[2];
		output += this.processEvent(rule, [one.id, rule.cause.type[1], two.id]);
		this.advance();
	}
	return output;
}

World.prototype.randomMatch = function(){
	var pair = this.twoThings();
	var one = pair[0], two = pair[1];
	var rule = this.findMatch(one, two);
	return [rule, one, two]
}

World.prototype.twoThings = function(){
	var thingOne = this.world[Math.floor(Math.random()*this.size)];
	var thingTwo = this.world[Math.floor(Math.random()*this.size)];
	while(thingTwo.id === thingOne.id){
		thingTwo = this.world[Math.floor(Math.random()*this.size)];
	}
	return [thingOne, thingTwo];
}

World.prototype.processEvent = function(rule, storyEvent){
	var cause = this.processElementValue(rule.cause.value, storyEvent);
	var consequent = this.processElementValue(rule.consequent.value, storyEvent);
	if(!!rule.consequentThing){
		var consequentThing = new Thing(rule.consequentThing, storyEvent, this);
		consequentThing.parentId = rule.id;
		this.addThing(consequentThing);
	}
	return cause + consequent;
}

World.prototype.processElementValue = function(element, originalElement){
	var result = [];
	_.each(element, function(el){
		result.push(this.getActor(el, originalElement));
	}, this)
	body = result.join(' ');
	body += '. ';
	return body;
}

World.prototype.getActor = function(value, storyElement){
	if(typeof value === 'number'){
		return this.getById(value).name;
	}
	else if(value === c.source){
		return this.getPiece(storyElement[0]).name
	}
	else if(value === c.target){
		return this.getPiece(storyElement[2]).name
	}
	else {
		return value;
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

World.prototype.findMatch = function(one, two){
	var rules = [];
	for(var i = 0; i < this.numRules; i++){
		var isMatch = this.checkMatch(this.rules[i], one, two);
		if(isMatch){
			rules.push(this.rules[i]);
		}
	}
	return rules[Math.floor(Math.random()*rules.length)];
}

World.prototype.checkMatch = function(rule, source, target, action){
	var match;
	var ruleSource = rule.getSource();
	var ruleTarget = rule.getTarget();

	var sourceMatch = ruleSource instanceof Type ? contains(source.getTypes(),ruleSource.get()) : ruleSource === source.id; 
	var targetMatch = ruleTarget instanceof Type ? contains(target.getTypes(),ruleTarget.get()) : ruleTarget === target.id;
	if(!rule.isDirectional){

		var flippedSourceMatch = ruleSource instanceof Type ? contains(target.getTypes(),ruleSource.get()) : ruleSource === target.id;
		var flippedTargetMatch = ruleTarget instanceof Type ? contains(source.getTypes(),ruleTarget.get()) : ruleTarget === source.id;
		
		match = (sourceMatch && targetMatch) || (flippedTargetMatch && flippedSourceMatch);
	
	} else { match = (sourceMatch && targetMatch); }

	if(action !== undefined){
		return match && (rule.getActionType() === action);
	} else {
		return match;
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

function contains(x, y){
	var result = true;
	_.each(y, function(item){
		result = result && _.contains(x, item);
	})
	return result;
}
