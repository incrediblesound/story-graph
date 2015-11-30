var World = require('./world.js');
var c = require('./constants.js');
var types = require('./types.js');
var _ = require('lodash');

var world = new World();

var wolf = world.addThing(types.animal, 'wolf');
var girl = world.addThing(types.girl, 'sally');
var hunter = world.addThing(types.man, 'hunter');


var wolfGirl = world.addRule({
	cause: {
		type:  [wolf, c.relations.encounter, types.girl], 
		value: [wolf, 'finds', c.events.target]
	},
	consequent: {
		type:  [c.events.target, c.relations.vanish],
		value: [c.events.source, 'eats', c.events.target]
	},
	isDirectional: false,
	name: 'wolf eating the girl'
})

var hunterGirl = world.addRule({
	cause: {
		type: [hunter, c.relations.encounter, types.girl], 
		value: [hunter, 'finds', c.events.target]
	},
	consequent: {
		type: [hunter, c.relations.stay], 
		value: [hunter, 'accompanies', girl]
	},
	name: 'the hunter and the girl'
})

var wolfruns = world.addRule({
	cause: {
		type: [wolf, c.relations.encounter, hunterGirl], 
		value: [wolf, 'sees', hunterGirl]
	},
	consequent: {
		type: [wolf, c.relations.out], 
		value: [wolf, 'runs']
	},
	name: 'the wolf running away'
})

var hunterFail = world.addRule({
	cause: {
		type: [hunter, c.relations.encounter, wolfGirl],
		value: [hunter, 'sees', wolfGirl]
	},
	consequent: {
		type: [hunter, c.relations.stay],
		value: [hunter, 'cries']
	},
	name: 'the hunter crying because the girl is lost'
})


var story1 = [
[wolf, c.relations.encounter, girl],
// [hunter, c.relations.encounter, wolfGirl]
]

var story2 = [
[hunter, c.relations.encounter, girl],
[wolf, c.relations.encounter, hunterGirl]
]

var x = [1,2,3,4]
var y = [3,4]

var story = world.runStory(story1);
console.log(story)
// story = world.runStory(story2);
// console.log(story);