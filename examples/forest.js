const World = require('../src/world/world.js');
const Actor = require('../src/components/actor.js');
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

const whisper = new Actor({
  type: bumbling(quiet(dark(spirit))),
  name: 'the whisper',
});

const reeds = new Actor({
  type: outpouring(beautiful(simple(plant))),
  name: 'the cat tails',
});

const river = new Actor({
  type: curving(complex(outpouring(spirit))),
  name: 'the river',
});

const shadow = new Actor({
  type: dark(inflowing(quiet(spirit))),
  name: 'the shadow',
});

const duck = new Actor({
  type: bumbling(outpouring(curving(animal))),
  name: 'a duck',
});

const bluejay = new Actor({
  type: bumbling(loud(jolting(animal))),
  name: 'a bluejay',
});

const sunlight = new Actor({
  type: outpouring(bright(simple(hot(spirit)))),
  name: 'the sunlight',
});

const snow = new Actor({
  type: bright(beautiful(complex(inflowing(cold(spirit))))),
  name: 'the snow',
});

const ice = new Actor({
  type: bright(beautiful(simple(inflowing(cold(spirit))))),
  name: 'the ice',
});

world.addActor([whisper, reeds, river, shadow, duck, snow, sunlight, bluejay, ice]);

world.addRule({
  cause: {
    type: [inflowing(spirit), c.encounter, outpouring(spirit)],
    template: [c.source, 'joins with', c.target, 'for a moment'],
  },
  consequent: {
    type: [],
    template: [c.source, 'does a whirling dance with', c.target],
  },
  isDirectional: false,
  consequentActor: {
    type: complex(connection),
    name: 'dancing with',
    members: [c.source, c.target],
    lifeTime: 2,
    initializeName: (actor) => `${actor.members[0].name} ${actor.name} ${actor.members[1].name}`
  },
});

world.addRule({
  cause: {
    type: [dark(entity), c.encounter, bright(entity)],
    template: [c.source, 'passes through', c.target],
  },
  consequent: {
    type: [],
    template: [c.source, 'is illuminated by', c.target],
  },
  isDirectional: true,
  mutations: source => {
    source.type.replace('dark', 'bright');
  },
});

world.addRule({
  cause: {
    type: [loud(entity), c.encounter, loud(entity)],
    template: [],
  },
  consequent: {
    type: [],
    template: [c.source, 'and', c.target, 'call out to each other'],
  },
  isDirectional: false,
  consequentActor: {
    type: complex(connection),
    name: 'calling out to',
    members: [c.source, c.target],
    lifeTime: 2,
    initializeName: (actor) => `${actor.members[0].name} ${actor.name} ${actor.members[1].name}`
  },
});

world.addRule({
  cause: {
    type: [life, c.encounter, quiet(spirit)],
    template: [c.source, 'approaches', c.target],
  },
  consequent: {
    type: [],
    template: [c.source, 'and', c.target, 'pass eachother quietly'],
  },
  isDirectional: true,
  consequentActor: {
    type: complex(connection),
    name: 'conversing silently with',
    members: [c.source, c.target],
    lifeTime: 2,
    initializeName: (actor) => `${actor.members[0].name} ${actor.name} ${actor.members[1].name}`
  },
});

world.addRule({
  cause: {
    type: [simple(hot(entity)), c.encounter, simple(cold(entity))],
    template: [c.source, 'radiates upon', c.target],
  },
  consequent: {
    type: [],
    template: [c.target, 'begins to crack and melt'],
  },
  isDirectional: true,
  consequentActor: {
    type: loud(complex(entity)),
    name: 'cracking and melting',
    members: [c.source, c.target],
    lifeTime: 2,
    initializeName: (actor) => `${actor.members[1].name} ${actor.name}`
  }
});


world.addRule({
  cause: {
    type: [entity, c.encounter, complex(connection)],
    template: [c.source, 'discovers', c.target],
  },
  consequent: {
    type: [c.source, c.move_in, c.target],
    template: [c.source, 'observes the patterns of', c.target],
  },
  isDirectional: true,
});

world.addRule({
  cause: {
    type: [entity, c.move_in, complex(connection)],
    template: [c.source, 'dwells in the stillness of life'],
  },
  consequent: {
    type: [c.source, c.stay],
    template: [],
  },
});

world.addRule({
  cause: {
    type: [jolting(entity), c.encounter, outpouring(entity)],
    template: [c.source, 'glances', c.target],
  },
  consequent: {
    type: [c.source, c.vanish],
    template: [c.source, 'flickers away'],
  },
  isDirectional: true,
});

/* eslint-disable no-console */
world.runStory(3);
console.log(world.output);
