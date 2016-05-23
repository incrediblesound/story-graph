const World = require('../src/world/world.js');
const world = new World();

const Thing = require('../src/components/thing.js');
const Type = require('../src/components/type.js');
const c = require('../src/components/constants.js');

const entity = new Type('entity');
const vapor = entity.extend('vapor');
const life = entity.extend('life');
const animal = life.extend('animal');
const solid = entity.extend('solid');

const light = type => {
  return type.extend('light');
};

const wet = type => {
  return type.extend('wet');
};

const slow = type => {
  return type.extend('slow');
};

const bright = type => {
  return type.extend('bright');
};

const dark = type => {
  return type.extend('dark');
};

const expansive = type => {
  return type.extend('expansive');
};

const small = type => {
  return type.extend('small');
};

const bird = animal.extend('bird');

world.addLocation({ name: 'the grey sky' });
world.addLocation({ name: 'the ocean' });
world.addLocation({ name: 'the seashore' });
world.addLocation({ name: 'the painted cliffs' });
world.addLocation({ name: 'the granite boulder' });

const minnows = world.addThing(new Thing({
  type: life,
  name: 'a group of minnows',
  locations: ['the ocean']
}));

const hermitcrabs = world.addThing(new Thing({
  type: life,
  name: 'hermit crabs',
  locations: ['the seashore']
}));

const crab = world.addThing(new Thing({
  type: slow(light(animal)),
  name: 'the tiny crab',
  locations: ['the seashore', 'the ocean']
}));

const clouds = world.addThing(new Thing({
  type: wet(bright(slow(vapor))),
  name: 'the clouds',
  locations: ['the grey sky', 'the painted cliffs', 'the ocean']
}));

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
  consequentThing: null
});

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
  consequentThing: null
});

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
  consequentThing: null
});

world.addRule({
  cause: {
    type: [bird, c.encounter, expansive(entity)],
    value: [c.source, 'swoops across', c.target]
  },
  consequent: {
    type: [],
    value: [c.source, 'soars high above', c.target]
  },
  isDirectional: true,
  mutations: null,
  consequentThing: null
});

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
  consequentThing: null
});

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
});

world.addRule({
  cause: {
    type: [bird, c.move_out, 'the grey sky'],
    value: ['']
  },
  consequent: {
    type: [c.source, c.move_in, 'the painted cliffs'],
    value: [c.source, 'swoops down onto', 'the painted cliffs']
  },
  isDirectional: true,
  mutations: null,
  consequentThing: null
});

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
});

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
});

world.addRule({
  cause: {
    type: [bird, c.move_out, 'the painted cliffs'],
    value: ['']
  },
  consequent: {
    type: [c.source, c.move_in, 'the granite boulder'],
    value: [c.source, 'settles on', 'the granite boulder']
  },
  isDirectional: true,
  mutations: null,
  consequentThing: null
});

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
});

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
});

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
    members: [],
    lifeTime: 4
  }
});

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
    members: [],
    lifeTime: 4
  }
});

/* eslint-disable no-console */
console.log(world.makeStory(8));
