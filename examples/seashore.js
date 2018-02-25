const SG = require('../dist/story.js');
const world = new SG.World();
const Actor = SG.Actor;
const Type = SG.Type;
const c = SG.constants;

const entity = new Type('entity');
const vapor = entity.extend('vapor');
const life = entity.extend('life');
const animal = life.extend('animal');
const solid = entity.extend('solid');

const light = type => type.extend('light');

const wet = type => type.extend('wet');

const slow = type => type.extend('slow');

const bright = type => type.extend('bright');

const dark = type => type.extend('dark');

const expansive = type => type.extend('expansive');

const small = type => type.extend('small');

const bird = animal.extend('bird');

world.addLocation({ name: 'the grey sky' });
world.addLocation({ name: 'the ocean' });
world.addLocation({ name: 'the seashore' });
world.addLocation({ name: 'the painted cliffs' });
world.addLocation({ name: 'the granite boulder' });

const gull = world.addActor(new Actor({
  type: bird,
  name: 'the seagull',
  locations: ['the grey sky']
}))

const cliffs = world.addActor(new Actor({
  type: dark(expansive(entity)),
  name: 'the cliffs',
  locations: null
}));

const ocean = world.addActor(new Actor({
  type: bright(expansive(entity)),
  name: 'the ocean',
  locations: null
}));

const minnows = world.addActor(new Actor({
  type: life,
  name: 'a group of minnows',
  locations: ['the ocean'],
}));

const hermitcrabs = world.addActor(new Actor({
  type: life,
  name: 'hermit crabs',
  locations: ['the seashore'],
}));

const crab = world.addActor(new Actor({
  type: slow(light(animal)),
  name: 'the tiny crab',
  locations: ['the seashore', 'the ocean'],
}));

const clouds = world.addActor(new Actor({
  type: wet(bright(slow(vapor))),
  name: 'the clouds',
  locations: ['the grey sky', 'the painted cliffs', 'the ocean'],
}));

world.addRule({
  cause: {
    type: [slow(vapor), c.ENCOUNTER, entity],
    template: [c.SOURCE, 'drifts across', c.TARGET],
  },
  consequent: {
    type: [],
    template: [c.TARGET, 'is hidden in', c.SOURCE,
    ],
  },
  isDirectional: true,
  mutations: null,
  consequentActor: null,
});

world.addRule({
  cause: {
    type: [crab, c.ENCOUNTER, hermitcrabs],
    template: [c.SOURCE, 'stumbles over', c.TARGET],
  },
  consequent: {
    type: [],
    template: [c.TARGET, 'rolls around'],
  },
  isDirectional: true,
  mutations: null,
  consequentActor: null,
});

world.addRule({
  cause: {
    type: [crab, c.ENCOUNTER, minnows],
    template: [c.SOURCE, 'startles', c.TARGET],
  },
  consequent: {
    type: [],
    template: [c.TARGET, 'dart away'],
  },
  isDirectional: true,
  mutations: null,
  consequentActor: null,
});

world.addRule({
  cause: {
    type: [bird, c.ENCOUNTER, expansive(entity)],
    template: [c.SOURCE, 'swoops across', c.TARGET],
  },
  consequent: {
    type: [],
    template: [c.SOURCE, 'soars high above', c.TARGET],
  },
  isDirectional: true,
  mutations: null,
  consequentActor: null,
});

world.addRule({
  cause: {
    type: [bird, c.ENCOUNTER, small(solid)],
    template: [c.SOURCE, 'discovers', c.TARGET],
  },
  consequent: {
    type: [],
    template: [c.SOURCE, 'settles upon', c.TARGET],
  },
  isDirectional: true,
  mutations: null,
  consequentActor: null,
});

world.addRule({
  cause: {
    type: [bird, c.MOVE_OUT, 'the grey sky'],
    template: [''],
  },
  consequent: {
    type: [c.SOURCE, c.MOVE_IN, 'the seashore'],
    template: [c.SOURCE, 'swoops down onto', 'the seashore'],
  },
  isDirectional: true,
  mutations: null,
  consequentActor: null,
});

world.addRule({
  cause: {
    type: [bird, c.MOVE_OUT, 'the grey sky'],
    template: [''],
  },
  consequent: {
    type: [c.SOURCE, c.MOVE_IN, 'the painted cliffs'],
    template: [c.SOURCE, 'swoops down onto', 'the painted cliffs'],
  },
  isDirectional: true,
  mutations: null,
  consequentActor: null,
});

world.addRule({
  cause: {
    type: [bird, c.MOVE_OUT, 'the seashore'],
    template: [''],
  },
  consequent: {
    type: [c.SOURCE, c.MOVE_IN, 'the grey sky'],
    template: [c.SOURCE, 'soars up into', 'the grey sky'],
  },
  isDirectional: true,
  mutations: null,
  consequentActor: null,
});

world.addRule({
  cause: {
    type: [bird, c.MOVE_OUT, 'the seashore'],
    template: [''],
  },
  consequent: {
    type: [c.SOURCE, c.MOVE_IN, 'the painted cliffs'],
    template: [c.SOURCE, 'flies over to', 'the painted cliffs'],
  },
  isDirectional: true,
  mutations: null,
  consequentActor: null,
});

world.addRule({
  cause: {
    type: [bird, c.MOVE_OUT, 'the painted cliffs'],
    template: [''],
  },
  consequent: {
    type: [c.SOURCE, c.MOVE_IN, 'the granite boulder'],
    template: [c.SOURCE, 'settles on', 'the granite boulder'],
  },
  isDirectional: true,
  mutations: null,
  consequentActor: null,
});

world.addRule({
  cause: {
    type: [crab, c.MOVE_OUT, 'the ocean'],
    template: [''],
  },
  consequent: {
    type: [c.SOURCE, c.MOVE_IN, 'the seashore'],
    template: [c.SOURCE, 'crawls slowly up onto', 'the seashore'],
  },
  isDirectional: true,
  mutations: null,
  consequentActor: null,
});

world.addRule({
  cause: {
    type: [life, c.MOVE_OUT, 'the seashore'],
    template: [''],
  },
  consequent: {
    type: [c.SOURCE, c.MOVE_IN, 'the ocean'],
    template: [c.SOURCE, 'is swept down into', 'the ocean'],
  },
  isDirectional: true,
  mutations: null,
  consequentActor: null,
});

world.addRule({
  cause: {
    type: [clouds, c.MOVE_OUT, 'the grey sky'],
    template: [''],
  },
  consequent: {
    type: [c.SOURCE, c.VANISH, 'the ocean'],
    template: [c.SOURCE, 'drift down onto', 'the ocean'],
  },
  isDirectional: true,
  mutations: null,
  consequentActor: {
    type: slow(dark(vapor)),
    name: 'A light fog',
    locations: ['the ocean'],
    members: [],
    lifeTime: 4,
  },
});

world.addRule({
  cause: {
    type: [clouds, c.MOVE_OUT, 'the grey sky'],
    template: [''],
  },
  consequent: {
    type: [c.SOURCE, c.VANISH, 'the painted cliffs'],
    template: [c.SOURCE, 'cling to', 'the painted cliffs'],
  },
  isDirectional: true,
  mutations: null,
  consequentActor: {
    type: slow(dark(vapor)),
    name: 'the fog',
    locations: ['the painted cliffs'],
    members: [],
    lifeTime: 4,
  },
});

/* eslint-disable no-console */
world.runStory(10, [
  { step: 1, event: [clouds, c.ENCOUNTER, cliffs] },
  { step: 3, event: [clouds, c.ENCOUNTER, ocean] }
]);

console.log(world.output);

// const test = world.testMatches()
// console.log(test)
