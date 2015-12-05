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
	this.world = this.world.slice(0, index).concat(this.world.slice(index+1, this.size));
	this.size--;
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
		var rule = nextEvent[0];
		var one = nextEvent[1];
		var two = nextEvent[2];
		output += this.processEvent(rule, [one.id, rule.cause.type[1], two.id]);
		this.advance();
	}
	return output;
}

World.prototype.processEvent = function(rule, storyEvent){
	var causeType = this.populateRuleType(rule.cause.value, storyEvent);
	var consequentType = this.populateRuleType(rule.consequent.value, storyEvent);
	var tertiaryType = this.populateRuleType(rule.consequent.type, storyEvent);

	var cause = this.processElementValue(causeType);
	var consequent = this.processElementValue(consequentType);
	var tertiary = tertiaryType !== undefined ? this.applyConsequent(tertiaryType) : '';

	if(!!rule.consequentThing){
		var consequentThing = new Thing(rule.consequentThing, storyEvent, this);
		consequentThing.parentId = rule.id;
		this.addThing(consequentThing);
	}
	var result = cause + consequent + tertiary;
	return result;
}

World.prototype.applyConsequent = function(typeExpression){
	if(!typeExpression.length || typeExpression[0] === undefined) return;

	if(!Array.isArray(typeExpression[0])){
		typeExpression = [typeExpression];
	}
	var result = '';
	_.each(typeExpression, function(expr){
		switch(expr[1]){
			case c.vanish:
				var thing = expr[0];
				this.removeThing(thing);
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

World.prototype.processPopulatedValue = function(element, source, target){
	var result = [], actor;
	_.each(element, function(el){
		if(el === c.source){
			actor = source.name;
		} else if(el === c.target){
			actor = target.name;
		} else {
			actor = el;
		}
		result.push(actor);
	}, this)
	body = result.join(' ');
	body += '. ';
	var head = body[0].toUpperCase();
	var tail = body.substring(1, body.length);
	body = head+tail;
	return body;
}

World.prototype.processElementValue = function(element, originalElement){
	var result = [];
	_.each(element, function(el){
		var actor = this.getPiece(el);
		if(actor !== undefined){
			actor = actor.name !== undefined ? actor.name : actor;
		}
		result.push(actor);
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
	var pair = this.twoThings();
	var one = pair[0], two = pair[1];
	var rule = this.matchRuleFor(one, two, c.encounter);
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
