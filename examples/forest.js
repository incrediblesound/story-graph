const World = require('../src/world/world.js');
const Thing = require('../src/components/thing.js');
const c = require('../src/components/constants.js');
const Type = require('../src/components/type.js');

const entity = new Type('entity');

const life = entity.extend('life');
const animal = life.extend('animal');
const plant = life.extend('plant');

const spirit = entity.extend('spirit');
const connection = new Type('connection');

const extendType = typeName => type => {
  if (type === undefined) {
    return new Type(typeName);
  }
  return type.extend(typeName);
};

const bumbling = extendType('bumbling');
const bright = extendType('bright');
const cold = extendType('cold');
const hot = extendType('hot');
const dark = extendType('dark');
const jolting = extendType('jolting');
const curving = extendType('curving');
const outpouring = extendType('outpouring');
const beautiful = extendType('beautiful');
const complex = extendType('complex');
const simple = extendType('simple');
const quiet = extendType('quiet');
const loud = extendType('loud');
const inflowing = extendType('inflowing');

const world = new World();

const whisper = new Thing({
  type: bumbling(quiet(dark(spirit))),
  name: 'the whisper',
});

const reeds = new Thing({
  type: outpouring(beautiful(simple(plant))),
  name: 'the cat tails',
});

const river = new Thing({
  type: curving(complex(outpouring(spirit))),
  name: 'the river',
});

const shadow = new Thing({
  type: dark(inflowing(quiet(spirit))),
  name: 'the shadow',
});

const duck = new Thing({
  type: bumbling(outpouring(curving(animal))),
  name: 'a duck',
});

const bluejay = new Thing({
  type: bumbling(loud(jolting(animal))),
  name: 'a bluejay',
});

const sunlight = new Thing({
  type: outpouring(bright(simple(hot(spirit)))),
  name: 'the sunlight',
});

const snow = new Thing({
  type: bright(beautiful(complex(inflowing(cold(spirit))))),
  name: 'the snow',
});

const ice = new Thing({
  type: bright(beautiful(simple(inflowing(cold(spirit))))),
  name: 'the ice',
});

world.addThing([whisper, reeds, river, shadow, duck, snow, sunlight, bluejay, ice]);

world.addRule({
  cause: {
    type: [inflowing(spirit), c.encounter, outpouring(spirit)],
    value: [c.source, 'joins with', c.target, 'for a moment'],
  },
  consequent: {
    type: [],
    value: [c.source, 'does a whirling dance with', c.target],
  },
  isDirectional: false,
  consequentThing: {
    type: complex(connection),
    name: 'dancing with',
    members: [c.source, c.target],
    lifeTime: 2,
    initialize: () => {
      this.name = `${this.members[0].name} ${this.name} ${this.members[1].name}`;
    },
  },
});

world.addRule({
  cause: {
    type: [dark(entity), c.encounter, bright(entity)],
    value: [c.source, 'passes through', c.target],
  },
  consequent: {
    type: [],
    value: [c.source, 'is illuminated by', c.target],
  },
  isDirectional: true,
  mutations: source => {
    source.type.replace('dark', 'bright');
  },
});

world.addRule({
  cause: {
    type: [loud(entity), c.encounter, loud(entity)],
    value: [],
  },
  consequent: {
    type: [],
    value: [c.source, 'and', c.target, 'call out to each other'],
  },
  isDirectional: false,
  consequentThing: {
    type: complex(connection),
    name: 'calling out to',
    members: [c.source, c.target],
    lifeTime: 2,
    initialize: () => {
      this.name = `${this.members[0].name} ${this.name} ${this.members[1].name}`;
    },
  },
});

world.addRule({
  cause: {
    type: [life, c.encounter, quiet(spirit)],
    value: [c.source, 'approaches', c.target],
  },
  consequent: {
    type: [],
    value: [c.source, 'and', c.target, 'pass eachother quietly'],
  },
  isDirectional: true,
  consequentThing: {
    type: complex(connection),
    name: 'conversing silently with',
    members: [c.source, c.target],
    lifeTime: 2,
    initialize: () => {
      this.name = `${this.members[0].name} ${this.name} ${this.members[1].name}`;
    },
  },
});

world.addRule({
  cause: {
    type: [simple(hot(entity)), c.encounter, simple(cold(entity))],
    value: [c.source, 'radiates upon', c.target],
  },
  consequent: {
    type: [],
    value: [c.target, 'begins to crack and melt'],
  },
  isDirectional: true,
  consequentThing: {
    type: loud(complex(entity)),
    name: 'cracking and melting',
    members: [c.source, c.target],
    lifeTime: 2,
    initialize: () => {
      this.name = `${this.members[1].name} ${this.name}`;
    },
  },
});


world.addRule({
  cause: {
    type: [entity, c.encounter, complex(connection)],
    value: [c.source, 'discovers', c.target],
  },
  consequent: {
    type: [c.source, c.move_in, c.target],
    value: [c.source, 'observes the patterns of', c.target],
  },
  isDirectional: true,
});

world.addRule({
  cause: {
    type: [entity, c.move_in, complex(connection)],
    value: [c.source, 'dwells in the stillness of life'],
  },
  consequent: {
    type: [c.source, c.stay],
    value: [],
  },
});

world.addRule({
  cause: {
    type: [jolting(entity), c.encounter, outpouring(entity)],
    value: [c.source, 'glances', c.target],
  },
  consequent: {
    type: [c.source, c.vanish],
    value: [c.source, 'flickers away'],
  },
  isDirectional: true,
});

/* eslint-disable no-console */
console.log(world.makeStory(3));
