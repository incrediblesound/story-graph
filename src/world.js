var _ = require('lodash');
var Type = require('./type.js');
var Thing = require('./thing.js');
var c = require('./constants.js');
var Rule = require('./rule.js');
var Location = require('./location.js');

var World = function(){
	this.size = 0;
	this.lastId = -1;
	this.world = [];

	this.numLocations = 0;
	this.locations = [];

	this.numRules = 0;
	this.rules = [];

	this.timeIndex = 0;
}

/*
 * Methods for processing passing time
 */

World.prototype.advance = function(){
	this.timeIndex++;
	_.each(this.world, function(thing, idx){
		if((this.timeIndex - thing.entryTime) >= thing.lifeTime){
			this.removeThing(thing.id);
		} 
		else if(thing.callback !== null){
			this.processTimeTrigger(thing.callback(this.timeIndex));
		}
	})
}

World.prototype.processTimeTrigger = function(timeEvent){
	//do smth
}

World.prototype.removeThing = function(id){
	var index = null;
	for(var i = 0; i < this.world.length; i++){
		if(this.world[i].id === id){
			index = i;
			break;
		}
	}
	if(index !== null){
		this.world.splice(index, 1);
		this.size--;
	}
}

/*
 * Methods for adding things into the world
 */

World.prototype.addRule = function(data){
	var id = this.numRules;
	var rule = new Rule(data, id);
	this.rules.push(rule);
	this.numRules++;
	return id;
}

World.prototype.addLocation = function(data){
	data.id = this.numLocations;
	this.locations.push(new Location(data));
	this.numLocations++;
}

World.prototype.addThing = function(thing){
	if(Array.isArray(thing)){
		_.each(thing, function(item){
			add.apply(this, [item]);
		}, this)
	} else {
		var id = add.apply(this, [thing]);
		return id;
	}

	function add(thing){
		var id = this.lastId+1;
		this.lastId = id;
		thing.id = id;
		thing.setEntryTime(this.timeIndex);
		this.world.push(thing);
		this.size++;
		return id;
	}
}

/*
 * Main run story functions
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
		if(nextEvent.length === 2){
			var rule = nextEvent[0]
			var thing = nextEvent[1]
			output += this.processEvent(rule, [thing.id, rule.cause.type[1]])
		} else {
			var rule = nextEvent[0];
			var one = nextEvent[1];
			var two = nextEvent[2];
			output += this.processEvent(rule, [one.id, rule.cause.type[1], two.id]);
		}
		this.advance();
	}
	return output;
}

World.prototype.processEvent = function(rule, storyEvent){
	var causeType = this.populateRuleType(rule.cause.value.slice(), storyEvent);
	var consequentType = this.populateRuleType(rule.consequent.value.slice(), storyEvent);
	var tertiaryType = this.populateRuleType(rule.consequent.type.slice(), storyEvent);

	var cause = this.processElementValue(causeType);
	var consequent = this.processElementValue(consequentType);
	var tertiary = tertiaryType !== undefined ? this.applyConsequent(tertiaryType) : '';

	if(!!rule.consequentThing){
		this.addConsequentThing(rule, storyEvent);
	}
	if(!!rule.mutations){
		this.runMutations(rule, storyEvent);
	}
	var result = cause + consequent + tertiary;
	return result;
}

World.prototype.addConsequentThing = function(rule, storyEvent){
	var consequentThing = new Thing(rule.consequentThing, storyEvent, this);
	consequentThing.parentId = rule.id;
	this.addThing(consequentThing);
}

World.prototype.runMutations = function(rule, storyEvent){
	var source = this.getById(storyEvent[0]);
	var target = this.getById(storyEvent[2]);
	rule.mutations(source, target);
}

World.prototype.applyConsequent = function(typeExpression){
	if(!typeExpression.length || typeExpression[0] === undefined) return;

	if(!Array.isArray(typeExpression[0])){
		typeExpression = [typeExpression];
	}
	var result = '';
	_.each(typeExpression, (expr) => {
		switch(expr[1]){
			case c.vanish:
				var thing = expr[0];
				this.removeThing(thing);
				break;
			case c.move_in:
				var thing = this.getById(expr[0]);
				thing.location = expr[2];
				break;
			default:
				var source = this.getPiece(expr[0]);
				var target = this.getPiece(expr[2]);
				var rule = this.matchRuleFor(source, target, expr[1]);
				if(rule !== undefined){
					result += this.processEvent(rule, expr);
				}
		}
	}, this)
	return result;
}

World.prototype.populateRuleType = function(event, sourceEvent){
	if(event === undefined || !event.length) return;

	event[0] = swap(event[0], sourceEvent);
	event[2] = swap(event[2], sourceEvent);
	return event;

	function swap(val, source){
		if(val === c.source){
			return source[0];
		} 
		else if(val === c.target){
			return source[2];
		} else {
			return val;
		}
	}
}

World.prototype.processElementValue = function(element, originalElement){
	var result = [];
	_.each(element, function(el){
		var actor = this.getPiece(el);
		if(actor !== undefined){
			actor = actor.name !== undefined ? actor.name : actor;
			result.push(actor);
		}
	}, this)
	body = result.join(' ');
	if(!body.length){
		return '';
	} else {
		body += '. ';
		var head = body[0].toUpperCase();
		var tail = body.substring(1, body.length);
		body = head+tail;
		return body;
	}
}

/*
 * The main match function that determines whether or not
 * an event [source, action, target] matches a rule
 */

World.prototype.checkMatch = function(rule, source, target, action){
	var match;
	var ruleSource = rule.getSource();
	var ruleTarget = rule.getTarget();

	var sourceMatch = ruleSource instanceof Type ? contains(source.getTypes(),ruleSource.get()) : ruleSource === source.id; 
	var targetMatch = (target === undefined) || (ruleTarget instanceof Type ? contains(target.getTypes(),ruleTarget.get()) : ruleTarget === target.id);

	if(!rule.isDirectional && target !== undefined){

		var flippedSourceMatch = ruleSource instanceof Type ? contains(target.getTypes(),ruleSource.get()) : ruleSource === target.id;
		var flippedTargetMatch = ruleTarget instanceof Type ? contains(source.getTypes(),ruleTarget.get()) : ruleTarget === source.id;
		
		match = (sourceMatch && targetMatch) || (flippedTargetMatch && flippedSourceMatch);
	
	} else { match = (sourceMatch && targetMatch); }

	var sourceInTarget = !(target === undefined) && !!target.members && _.where(target.members, {id: source.id}).length;
	var targetInSource = !(target === undefined) && !!source.members && _.where(source.members, {id: target.id}).length;

	if(action !== undefined){

		return match && (rule.getActionType() === action) && !(sourceInTarget || targetInSource);

	} else {

		return match && !(sourceInTarget || targetInSource);
	}

}

World.prototype.checkTransitionMatch = function(rule, thing, locations, action){
	var ruleSource = rule.getSource();
	var targetLocation = rule.getConsequentTarget();
	var sourceMatch = ruleSource instanceof Type ? contains(thing.getTypes(), ruleSource.get()) : ruleSource === thing.id;
	var locationMatch = _.contains(locations, targetLocation);
	var actionMatch = rule.getActionType() === action;

	return sourceMatch && locationMatch && actionMatch
}

/*
 * Various helper functions for the above methods
 */

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
	if(piece === undefined) return;

	if(typeof piece === 'number'){
		return this.getById(piece);
	} else if(typeof piece === 'string'){
		return piece;
	} else if(piece.where !== undefined){
		var property = piece.where[0];
		var value = piece.where[1];
		for(var i = 0; i < this.size; i++){
			if(this.world[i][property] === value){
				return this.world[i];
			}
		}
	}
}

World.prototype.randomMatch = function(){
	if(this.numLocations && rollDie() < 1){
		return this.randomTransition()
	} else {
		var pair = this.twoThings();
		var one = pair[0], two = pair[1];
		var rule = this.matchRuleFor(one, two, c.encounter);
		return [rule, one, two]
	}
}

World.prototype.randomTransition = function(){
	var moveableSet = _.filter(this.world, (thing) => {
		return thing.locations.length > 1
	})
	var index = Math.floor(Math.random() * moveableSet.length)
	var randomThing = moveableSet[index]
	var transition = this.matchTransitionFor(randomThing);
	return [transition, randomThing]
}

World.prototype.twoThings = function(){
	var localSet = [], randomLocation;
	if(this.numLocations){
		while(localSet.length < 2){
			randomLocation = this.locations[Math.floor(Math.random()*this.numLocations)]
			localSet = this.getLocalSet(randomLocation)
		}
	} else {
		localSet = this.world.slice();
	}
	var thingOne = _.first(localSet.splice(Math.floor(Math.random()*localSet.length), 1));
	var thingTwo = _.first(localSet.splice(Math.floor(Math.random()*localSet.length), 1));
	return [thingOne, thingTwo];
}

World.prototype.matchRuleFor = function(one, two, action){
	var rules = [];
	for(var i = 0; i < this.numRules; i++){
		var isMatch = this.checkMatch(this.rules[i], one, two, action);
		if(isMatch){
			rules.push(this.rules[i]);
		}
	}
	return rules[Math.floor(Math.random()*rules.length)];
}

World.prototype.matchTransitionFor = function(thing){
	var potentialLocations = _.without(thing.locations, thing.location);
	var rules = [];
	for(var i = 0; i < this.numRules; i++){
		var isMatch = this.checkTransitionMatch(this.rules[i], thing, potentialLocations, c.move_out);
		if(isMatch){
			rules.push(this.rules[i]);
		}
	}
	return rules[Math.floor(Math.random()*rules.length)];
}

World.prototype.getLocationByName = function(name){
	for(var i = 0; i < this.locations; i++){
		if(this.locations[i].name === name){
			return this.locations[i].id;
		}
	}
}

World.prototype.getLocalSet = function(location){
	return _.filter(this.world, (thing) => {
		return thing.location === location.name
	})
}

World.prototype.getLocationById = function(id){
	for(var i = 0; i < this.locations; i++){
		if(this.locations[i].id === id){
			return this.locations[i];
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

// special contains for dealing with types
// returns true if all of y are in x
function contains(x, y){
	var result = true;
	_.each(y, function(item){
		result = result && _.contains(x, item);
	})
	return result;
}

function rollDie(){
	return Math.floor(Math.random() * 7 )
}
