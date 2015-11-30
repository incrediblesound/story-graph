var World = require('./world.js');
var c = require('./constants.js');

var world = new World();

var wolf = world.addThing('wolf');
var girl = world.addThing('girl');
var hunter = world.addThing('hunter');


var wolfGirl = world.addRule({
	cause: {
		type:  [wolf, c.relations.encounter, girl], 
		value: [wolf, 'finds', girl]
	},
	consequent: {
		type:  [girl, c.relations.vanish],
		value: [wolf, 'eats', girl]
	},
	name: 'wolf eating the girl'
})

var hunterGirl = world.addRule({
	cause: {
		type: [hunter, c.relations.encounter, girl], 
		value: [hunter, 'finds', girl]
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
[hunter, c.relations.encounter, wolfGirl]
]

var story2 = [
[hunter, c.relations.encounter, girl],
[wolf, c.relations.encounter, hunterGirl]
]

var story = world.runStory(story1);
console.log(story)
story = world.runStory(story2);
console.log(story);