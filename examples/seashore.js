var World = require('../src/world.js');
var world = new World();

var Thing = require('../src/thing.js');
var Type = require('../src/type.js');var c = require('../src/constants.js');var entity = new Type('entity')
var vapor = entity.extend('vapor')

var life = entity.extend('life')

var animal = life.extend('animal')

var solid = entity.extend('solid')

var light = function(type){
	return type.extend('light');
}

var heavy = function(type){
	return type.extend('heavy');
}

var wet = function(type){
	return type.extend('wet');
}

var dry = function(type){
	return type.extend('dry');
}

var slow = function(type){
	return type.extend('slow');
}

var fast = function(type){
	return type.extend('fast');
}

var bright = function(type){
	return type.extend('bright');
}

var dark = function(type){
	return type.extend('dark');
}

var expansive = function(type){
	return type.extend('expansive');
}

var small = function(type){
	return type.extend('small');
}

var rock = solid.extend('rock')

var bird = animal.extend('bird')

world.addLocation({ name: 'the grey sky' });

world.addLocation({ name: 'the ocean' });

world.addLocation({ name: 'the seashore' });

world.addLocation({ name: 'the painted cliffs' });

var crow = new Thing({type: dark(bird), name: 'the crow', locations: ["the grey sky","the seashore","the painted cliffs"] })
var crow = world.addThing(crow)

var minnows = new Thing({type: life, name: 'a group of minnows', locations: ["the ocean"] })
var minnows = world.addThing(minnows)

var hermitcrabs = new Thing({type: life, name: 'hermit crabs', locations: ["the seashore"] })
var hermitcrabs = world.addThing(hermitcrabs)

var gull = new Thing({type: bright(bird), name: 'the gull', locations: ["the grey sky","the seashore", "the painted cliffs"] })
var gull = world.addThing(gull)

var crab = new Thing({type: slow(light(animal)), name: 'the tiny crab', locations: ["the seashore","the ocean"] })
var crab = world.addThing(crab)

var waves = new Thing({type: light(wet(entity)), name: 'sluggish waves', locations: ["the ocean"] })
var waves = world.addThing(waves)

var clouds = new Thing({type: wet(bright(slow(vapor))), name: 'clouds', locations: ["the grey sky", "the painted cliffs", "the ocean"] })
var clouds = world.addThing(clouds)

var Boulder = new Thing({type: small(rock), name: 'the granite boulder', locations: ["the seashore"] })
var Boulder = world.addThing(Boulder)

var cliff = new Thing({type: expansive(rock), name: 'cliff', locations: ["the painted cliffs"] })
var cliff = world.addThing(cliff)

var shadows = new Thing({type: dark(expansive(entity)), name: 'shadows', locations: ["the painted cliffs"] })
var shadows = world.addThing(shadows)

var branch = new Thing({type: small(solid), name: 'branch', locations: ["the painted cliffs"] })
var branch = world.addThing(branch)

var ledge = new Thing({type: small(solid), name: 'ledge', locations: ["the painted cliffs"] })
var ledge = world.addThing(ledge)

world.addRule({
	cause: {
		type: [slow(vapor), c.encounter, entity],
		value: [c.source, 'drifts across', c.target]
	},
	consequent: {
		type: [],
		value: [c.target, 'is hidden in', c.source
		]
	},
	isDirectional: true,
	mutations: null,
	consequentThing: null/*{ type:'', name:'', members:[c.source,c.target],lifeTime: 1, initialize: function(world){}}*/
})

world.addRule({
	cause: {
		type: [crab, c.encounter, hermitcrabs],
		value: [c.source, 'stumbles over', c.target]
	},
	consequent: {
		type: [],
		value: [c.target, 'rolls around']
	},
	isDirectional: true,
	mutations: null,
	consequentThing: null/*{ type:'', name:'', members:[c.source,c.target],lifeTime: 1, initialize: function(world){}}*/
})

world.addRule({
	cause: {
		type: [crab, c.encounter, minnows],
		value: [c.source, 'startles', c.target]
	},
	consequent: {
		type: [],
		value: [c.target, 'dart away']
	},
	isDirectional: true,
	mutations: null,
	consequentThing: null/*{ type:'', name:'', members:[c.source,c.target],lifeTime: 1, initialize: function(world){}}*/
})

world.addRule({
	cause: {
		type: [bird, c.encounter, expansive(entity)],
		value: [c.source, 'flies into', c.target]
	},
	consequent: {
		type: [],
		value: [c.source, 'soars high above', c.target]
	},
	isDirectional: true,
	mutations: null,
	consequentThing: null/*{ type:'', name:'', members:[c.source,c.target],lifeTime: 1, initialize: function(world){}}*/
})

world.addRule({
	cause: {
		type: [bird, c.encounter, small(solid)],
		value: [c.source, 'discovers', c.target]
	},
	consequent: {
		type: [],
		value: [c.source, 'settles upon', c.target]
	},
	isDirectional: true,
	mutations: null,
	consequentThing: null/*{ type:'', name:'', members:[c.source,c.target],lifeTime: 1, initialize: function(world){}}*/
})

world.addRule({
	cause: {
		type: [bird, c.move_out, 'the grey sky'],
		value: ['']
	},
	consequent: {
		type: [c.source, c.move_in, 'the seashore'],
		value: [c.source, 'swoops down onto', 'the seashore']
	},
	isDirectional: true,
	mutations: null,
	consequentThing: null
})

world.addRule({
	cause: {
		type: [bird, c.move_out, 'the grey sky'],
		value: ['']
	},
	consequent: {
		type: [c.source, c.move_in, 'the seashore'],
		value: [c.source, 'swoops down onto', 'the painted cliffs']
	},
	isDirectional: true,
	mutations: null,
	consequentThing: null
})

world.addRule({
	cause: {
		type: [bird, c.move_out, 'the seashore'],
		value: ['']
	},
	consequent: {
		type: [c.source, c.move_in, 'the grey sky'],
		value: [c.source, 'soars up into', 'the grey sky']
	},
	isDirectional: true,
	mutations: null,
	consequentThing: null
})

world.addRule({
	cause: {
		type: [bird, c.move_out, 'the seashore'],
		value: ['']
	},
	consequent: {
		type: [c.source, c.move_in, 'the painted cliffs'],
		value: [c.source, 'flies over to', 'the painted cliffs']
	},
	isDirectional: true,
	mutations: null,
	consequentThing: null
})

world.addRule({
	cause: {
		type: [crab, c.move_out, 'the ocean'],
		value: ['']
	},
	consequent: {
		type: [c.source, c.move_in, 'the seashore'],
		value: [c.source, 'crawls slowly up onto', 'the seashore']
	},
	isDirectional: true,
	mutations: null,
	consequentThing: null
})

world.addRule({
	cause: {
		type: [crab, c.move_out, 'the seashore'],
		value: ['']
	},
	consequent: {
		type: [c.source, c.move_in, 'the ocean'],
		value: [c.source, 'is swept down into', 'the ocean']
	},
	isDirectional: true,
	mutations: null,
	consequentThing: null
})

world.addRule({
	cause: {
		type: [clouds, c.move_out, 'the grey sky'],
		value: ['']
	},
	consequent: {
		type: [c.source, c.vanish, 'the ocean'],
		value: [c.source, 'drift down onto', 'the ocean']
	},
	isDirectional: true,
	mutations: null,
	consequentThing: { 
		type: slow(dark(vapor)), 
		name: 'A light fog',
		locations: ['the ocean'],
		members:[],
		lifeTime: 4, 
	}
})

world.addRule({
	cause: {
		type: [clouds, c.move_out, 'the grey sky'],
		value: ['']
	},
	consequent: {
		type: [c.source, c.vanish, 'the painted cliffs'],
		value: [c.source, 'cling to', 'the painted cliffs']
	},
	isDirectional: true,
	mutations: null,
	consequentThing: { 
		type: slow(dark(vapor)), 
		name: 'the fog',
		locations: ['the painted cliffs'],
		members:[],
		lifeTime: 4, 
	}
})

var story = world.makeStory(8);
console.log(story)