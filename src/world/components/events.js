var Thing = require('../../components/thing.js');
var c = require('../../components/constants.js');
var utility = require('./utility.js');

var _ = require('lodash')

module.exports = {
	processEvent,
	addConsequentThing,
	runMutations,
	applyConsequent,
	populateRuleType,
	processElementValue
}

function processEvent(world, rule, storyEvent){
	var causeType = populateRuleType(world, rule.cause.value.slice(), storyEvent);
	var consequentType = populateRuleType(world, rule.consequent.value.slice(), storyEvent);
	var tertiaryType = populateRuleType(world, rule.consequent.type.slice(), storyEvent);
	var cause = processElementValue(world, causeType);
	var consequent = processElementValue(world, consequentType);
	var tertiary = tertiaryType !== undefined ? applyConsequent(world, tertiaryType) : '';

	if(!!rule.consequentThing){
		addConsequentThing(world, rule, storyEvent);
	}
	if(!!rule.mutations){
		runMutations(world, rule, storyEvent);
	}
	var result = cause + consequent + tertiary;
	return result;
}

function addConsequentThing(world, rule, storyEvent){
	var consequentThing = new Thing(rule.consequentThing, storyEvent, world);
	consequentThing.parentId = rule.id;
	world.addThing(consequentThing);
}

function runMutations(world, rule, storyEvent){
	var source = world.getThingById(storyEvent[0]);
	var target = world.getThingById(storyEvent[2]);
	rule.mutations(source, target);
}

function applyConsequent(world, typeExpression){
	if(!typeExpression.length || typeExpression[0] === undefined) return;

	if(!Array.isArray(typeExpression[0])){
		typeExpression = [typeExpression];
	}
	var result = '';
	_.each(typeExpression, (expr) => {
		switch(expr[1]){
			case c.vanish:
				var thing = expr[0];
				utility.removeThing(thing);
				break;
			case c.move_in:
				var thing = world.getThingById(expr[0]);
				thing.location = expr[2];
				break;
			default:
				var source = utility.getPiece(expr[0]);
				var target = utility.getPiece(expr[2]);
				var rule = this.matchRuleFor(source, target, expr[1]);
				if(rule !== undefined){
					result += this.processEvent(rule, expr);
				}
		}
	}, this)
	return result;
}

function populateRuleType(world, event, sourceEvent){
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

function processElementValue(world, element, originalElement){
	var result = [];
	_.each(element, (el) => {
		var actor = utility.getPiece(world, el);

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