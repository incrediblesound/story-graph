var World = require('./src/world.js');
var Thing = require('./src/thing.js');
var c = require('./src/constants.js');
var _ = require('lodash');
var Type = require('./src/type.js');

var person = new Type('person');
var gathering = new Type('gathering');
var relationship = new Type('relationship');
var discussion = gathering.extend('discussion');
var niceChat = discussion.extend('intelligent');
var boy = person.extend('boy');
var girl = person.extend('girl');

var extendType = function(typeName){
	return function(type){
		return type.extend(typeName);
	}
}

var romantic = extendType('romantic');
var smart = extendType('smart');
var funny = extendType('funny');
var handsome = extendType('handsome');
var creative = extendType('creative');
var beautiful = extendType('beautiful');
var technical = extendType('technical');
var nice = extendType('nice');
var rude = extendType('rude');
var odd = extendType('odd');

var world = new World();

var bob = new Thing({
  type: handsome(smart(technical(rude(boy)))),
  name: 'Bob'
})

var tim = new Thing({
  type: handsome(funny(nice(boy))),
  name: 'Tim'
})

var dan = new Thing({
	type: smart(funny(creative(odd(boy)))),
	name: 'Dan'
})

var lisa = new Thing({
	type: smart(creative(odd(girl))),
	name: 'Lisa'
})

var alice = new Thing({
	type: smart(beautiful(rude(girl))),
	name: 'Alice'
})

world.addThing([bob, tim, dan, lisa, alice]);

world.addRule({
  cause:{
    type: [creative(person), c.encounter, smart(person)],
    value: [c.source, 'meets', c.target]
  },
  consequent: {
    type: [],
    value: [c.source, 'argues with', c.target]
  },
  isDirectional: false,
  consequentThing: {
    type: discussion,
    name: 'arguing with',
    lifeTime: 1,
    initialize: function(storyEvent, world){
    	var source = world.getPiece(storyEvent[0]);
    	var target = world.getPiece(storyEvent[2]);
    	this.name = source.name+' '+this.name+' '+target.name
    }
  }
})

world.addRule({
  cause:{
    type: [handsome(rude(boy)), c.encounter, smart(beautiful(girl))],
    value: [c.source, 'meets', c.target]
  },
  consequent: {
    type: [],
    value: [c.source, 'makes silly comments about', c.target, 'but she has a smart response']
  },
  isDirectional: true,
  consequentThing: {
    type: discussion,
    name: 'chatting with',
    lifeTime: 1,
    initialize: function(storyEvent, world){
    	var source = world.getPiece(storyEvent[0]);
    	var target = world.getPiece(storyEvent[2]);
    	this.name = source.name+' '+this.name+' '+target.name
    }
  }
})

world.addRule({
  cause:{
    type: [funny(smart(boy)), c.encounter, smart(creative(girl))],
    value: [c.source, 'meets', c.target]
  },
  consequent: {
    type: [],
    value: [c.source, 'and', c.target, 'enjoy spending time together.']
  },
  isDirectional: false,
  consequentThing: {
    type: romantic(relationship),
    name: 'is together with',
    lifeTime: Math.floor(Math.random()*4),
    initialize: function(storyEvent, world){
    	var source = world.getPiece(storyEvent[0]);
    	var target = world.getPiece(storyEvent[2]);
    	this.name = source.name+' '+this.name+' '+target.name
    }
  }
})

world.addRule({
  cause:{
    type: [smart(person), c.encounter, smart(person)],
    value: [c.source, 'meets', c.target]
  },
  consequent: {
    type: [],
    value: [c.source, 'has a nice discussion with', c.target]
  },
  isDirectional: false,
  consequentThing: {
    type: niceChat,
    name: 'having a nice chat with',
    lifeTime: 1,
    initialize: function(storyEvent, world){
    	var source = world.getPiece(storyEvent[0]);
    	var target = world.getPiece(storyEvent[2]);
    	this.name = source.name+' '+this.name+' '+target.name
    }
  }
})

world.addRule({
  cause:{
    type: [rude(person), c.encounter, niceChat],
    value: [c.source, 'meets', c.target]
  },
  consequent: {
    type: [],
    value: [c.source, 'interrupts the conversation']
  },
  isDirectional: true,
})


console.log(world.makeStory(4));