var World = require('../src/world/world.js');
var Thing = require('../src/components/thing.js');
var c = require('../src/components/constants.js');
var _ = require('lodash');
var Type = require('../src/components/type.js');

var entity = new Type('entity');

var life = entity.extend('life');
var animal = life.extend('animal');
var plant = life.extend('plant');

var spirit = entity.extend('spirit');
var connection = new Type('connection');

var extendType = function(typeName){
    return function(type){
    if(type === undefined){
      return new Type(typeName);
    } else {
          return type.extend(typeName);
    }
    }
}

var bumbling = extendType('bumbling');
var bright = extendType('bright');
var cold = extendType('cold');
var hot = extendType('hot');
var dark = extendType('dark');
var smart = extendType('smart');
var jolting = extendType('jolting');
var curving = extendType('curving');
var outpouring = extendType('outpouring');
var beautiful = extendType('beautiful');
var complex = extendType('complex');
var simple = extendType('simple');
var quiet = extendType('quiet');
var loud = extendType('loud');
var inflowing = extendType('inflowing');

var world = new World();

var whisper = new Thing({
  type: bumbling(quiet(dark(spirit))),
  name: 'the whisper'
})

var reeds = new Thing({
  type: outpouring(beautiful(simple(plant))),
  name: 'the cat tails'
})

var river = new Thing({
    type: curving(complex(outpouring(spirit))),
    name: 'the river'
})

var shadow = new Thing({
    type: dark(inflowing(quiet(spirit))),
    name: 'the shadow'
})

var duck = new Thing({
    type: bumbling(outpouring(curving(animal))),
    name: 'a duck'
})

var bluejay = new Thing({
  type: bumbling(loud(jolting(animal))),
  name: 'a bluejay'
})

var sunlight = new Thing({
  type: outpouring(bright(simple(hot(spirit)))),
  name: 'the sunlight'
})

var snow = new Thing({
  type: bright(beautiful(complex(inflowing(cold(spirit))))),
  name: 'the snow'
})

var ice = new Thing({
  type: bright(beautiful(simple(inflowing(cold(spirit))))),
  name: 'the ice'
})

world.addThing([whisper, reeds, river, shadow, duck, snow, sunlight, bluejay, ice]);

world.addRule({
  cause:{
    type: [inflowing(spirit), c.encounter, outpouring(spirit)],
    value: [c.source, 'joins with', c.target, 'for a moment']
  },
  consequent: {
    type: [],
    value: [c.source, 'does a whirling dance with', c.target]
  },
  isDirectional: false,
  consequentThing: {
    type: complex(connection),
    name: 'dancing with',
    members: [c.source, c.target],
    lifeTime: 2,
    initialize: function(storyEvent, world){
        this.name = this.members[0].name+' '+this.name+' '+this.members[1].name;
    }
  }
})

world.addRule({
  cause:{
    type: [dark(entity), c.encounter, bright(entity)],
    value: [c.source, 'passes through', c.target]
  },
  consequent: {
    type: [],
    value: [c.source, 'is illuminated by', c.target]
  },
  isDirectional: true,
  mutations: function(source, target){
    source.type.replace('dark', 'bright');
  }
})

world.addRule({
  cause:{
    type: [ loud(entity), c.encounter, loud(entity)],
    value: []
  },
  consequent: {
    type: [],
    value: [c.source, 'and', c.target, 'call out to each other']
  },
  isDirectional: false,
  consequentThing: {
    type: complex(connection),
    name: 'calling out to',
    members: [c.source, c.target],
    lifeTime: 2,
    initialize: function(storyEvent, world){
      this.name = this.members[0].name+' '+this.name+' '+this.members[1].name;
    }
  }
})

world.addRule({
  cause:{
    type: [ life, c.encounter, quiet(spirit)],
    value: [c.source, 'approaches', c.target]
  },
  consequent: {
    type: [],
    value: [c.source, 'and', c.target, 'pass eachother quietly']
  },
  isDirectional: true,
    consequentThing: {
    type: complex(connection),
    name: 'conversing silently with',
    members: [c.source, c.target],
    lifeTime: 2,
    initialize: function(storyEvent, world){
      this.name = this.members[0].name+' '+this.name+' '+this.members[1].name;
    }
  }
})

world.addRule({
  cause:{
    type: [ simple(hot(entity)), c.encounter, simple(cold(entity))],
    value: [c.source, 'radiates upon', c.target]
  },
  consequent: {
    type: [],
    value: [c.target, 'begins to crack and melt']
  },
  isDirectional: true,
    consequentThing: {
    type: loud(complex(entity)),
    name: 'cracking and melting',
    members: [c.source, c.target],
    lifeTime: 2,
    initialize: function(storyEvent, world){
      this.name = this.members[1].name+' '+this.name;
    }
  }
})


world.addRule({
  cause:{
    type: [entity, c.encounter, complex(connection)],
    value: [c.source, 'discovers', c.target]
  },
  consequent: {
    type: [c.source, c.move_in, c.target],
    value: [c.source, 'observes the patterns of', c.target]
  },
  isDirectional: true
})

world.addRule({
  cause: {
    type: [entity, c.move_in, complex(connection)],
    value: [c.source, 'dwells in the stillness of life']
  },
  consequent: {
    type: [c.source, c.stay],
    value: []
  }
})

world.addRule({
  cause:{
    type: [jolting(entity), c.encounter, outpouring(entity)],
    value: [c.source, 'glances', c.target]
  },
  consequent: {
    type: [c.source, c.vanish],
    value: [c.source, 'flickers away']
  },
  isDirectional: true,
})

console.log(world.makeStory(3));
