var World = require('./world.js');
var Thing = require('./thing.js');
var c = require('./constants.js');
var types = require('./types.js');
var _ = require('lodash');

var world = new World();

var wolf = new Thing({
	type: types.animal,
	name: 'wolf'
})

var girl = new Thing({
	type: types.girl,
	name: 'little girl sally'
})

var hunter = new Thing({
	type: types.man,
	name: 'hunter'
})

var wolfId = world.addThing(wolf);
var girlId = world.addThing(girl);
var hunterId = world.addThing(hunter);


var wolfGirl = world.addRule({
	cause: {
		type:  [wolfId, c.relations.encounter, types.girl], 
		value: [wolfId, 'finds', c.events.target]
	},
	consequent: {
		type:  [c.events.target, c.relations.vanish],
		value: [c.events.source, 'eats', c.events.target]
	},
	isDirectional: false,
	consequentThing: new Thing({ 
		type: types.tragedy, 
		name: 'wolf eats the girl',
		lifeTime: 1
	})
})

var hunterGirl = world.addRule({
	cause: {
		type: [hunterId, c.relations.encounter, types.girl], 
		value: [hunterId, 'finds', c.events.target]
	},
	consequent: {
		type: [hunterId, c.relations.stay], 
		value: [hunterId, 'accompanies', girlId]
	},
	consequentThing: new Thing({ 
		type: types.group, 
		name: 'hunter and the girl',
		lifeTime: Math.floor(Math.random() * 4),
	})
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
	consequentThing: new Thing({ 
		type: types.situation, 
		name: 'the wolf running away',
		lifeTime: 1
	})
})

var hunterSad = world.addRule({
	cause: {
		type: [hunter, c.relations.encounter, types.tragedy],
		value: [hunter, 'sees', c.events.target]
	},
	consequent: {
		type: [hunter, c.relations.stay],
		value: [hunter, 'cries']
	},
})


var story1 = [
[wolfId, c.relations.encounter, girlId],
// [hunter, c.relations.encounter, wolfGirl]
]

var story2 = [
[hunterId, c.relations.encounter, girlId],
[wolfId, c.relations.encounter, {where: ['name', 'hunter and the girl']}]
]

var story = world.runStory(story1);
console.log(story)
story = world.runStory(story2);
console.log(story);