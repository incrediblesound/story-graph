var World = require('./world.js');
var Thing = require('./thing.js');
var c = require('./constants.js');
var types = require('./types.js');
var _ = require('lodash');

var world = new World();

var wolf = new Thing({
	type: types.animal,
	name: 'a wolf'
})

var girl = new Thing({
	type: types.girl,
	name: 'Sally'
})

var hunter = new Thing({
	type: types.man,
	name: 'the hunter'
})

var wolfId = world.addThing(wolf);
var girlId = world.addThing(girl);
var hunterId = world.addThing(hunter);


var wolfGirl = world.addRule({
	cause: {
		type:  [wolfId, c.relations.encounter, types.child], 
		value: [wolfId, 'finds', c.events.target]
	},
	consequent: {
		type:  [c.events.target, c.relations.vanish],
		value: [c.events.source, 'eats', c.events.target]
	},
	isDirectional: false,
	consequentThing: { 
		type: types.tragedy, 
		name: 'a wolf eating ',
		lifeTime: 1,
		initialize: function(storyEvent, world){
			var target = world.getPiece(storyEvent[2]);
			this.name += target.name;
		}
	}
})

var hunterGirl = world.addRule({
	cause: {
		type: [hunterId, c.relations.encounter, types.child], 
		value: [hunterId, 'finds', c.events.target]
	},
	consequent: {
		type: [hunterId, c.relations.stay], 
		value: [hunterId, 'accompanies', girlId]
	},
	consequentThing: { 
		type: types.group, 
		name: 'the hunter and ',
		lifeTime: Math.floor(Math.random() * 4),
		initialize: function(storyEvent, world){
			var target = world.getPiece(storyEvent[2]);
			this.name += target.name;
		}
	}
})

var wolfruns = world.addRule({
	cause: {
		type: [wolfId, c.relations.encounter, types.group], 
		value: [wolfId, 'sees', c.events.target]
	},
	consequent: {
		type: [wolfId, c.relations.out], 
		value: [wolfId, 'runs']
	},
	consequentThing: { 
		type: types.situation, 
		name: 'the wolf running away',
		lifeTime: 1
	}
})

var hunterSad = world.addRule({
	cause: {
		type: [hunterId, c.relations.encounter, types.tragedy],
		value: [hunterId, 'sees', c.events.target]
	},
	consequent: {
		type: [hunterId, c.relations.stay],
		value: [hunterId, 'cries']
	},
})


var story1 = [
[wolfId, c.relations.encounter, girlId],
[hunterId, c.relations.encounter, {where: ['parentId', wolfGirl]}]
]

var story2 = [
[hunterId, c.relations.encounter, girlId],
[wolfId, c.relations.encounter, {where: ['parentId', hunterGirl]}]
]

var story = world.runStory(story1);
console.log(story)
story = world.runStory(story2);
console.log(story);