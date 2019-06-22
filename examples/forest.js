const SG = require('../dist/story.js');
const world = new SG.World();
const Actor = SG.Actor;
const Type = SG.Type;
const c = SG.constants;

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
    type: [inflowing(spirit), c.ENCOUNTER, outpouring(spirit)],
    template: [c.SOURCE, 'joins with', c.TARGET, 'for a moment'],
  },
  consequent: {
    type: [],
    template: [c.SOURCE, 'does a whirling dance with', c.TARGET],
  },
  isDirectional: false,
  consequentActor: {
    type: complex(connection),
    name: 'dancing with',
    members: [c.SOURCE, c.TARGET],
    lifeTime: 2,
    initializeName: (actor) => `${actor.members[0].name} ${actor.name} ${actor.members[1].name}`
  },
});

world.addRule({
  cause: {
    type: [dark(entity), c.ENCOUNTER, bright(entity)],
    template: [c.SOURCE, 'passes through', c.TARGET],
  },
  consequent: {
    type: [],
    template: [c.SOURCE, 'is illuminated by', c.TARGET],
  },
  isDirectional: true,
  mutations: source => {
    source.type.replace('dark', 'bright');
  },
});

world.addRule({
  cause: {
    type: [loud(entity), c.ENCOUNTER, loud(entity)],
    template: [],
  },
  consequent: {
    type: [],
    template: [c.SOURCE, 'and', c.TARGET, 'call out to each other'],
  },
  isDirectional: false,
  consequentActor: {
    type: complex(connection),
    name: 'calling out to',
    members: [c.SOURCE, c.TARGET],
    lifeTime: 2,
    initializeName: (actor) => `${actor.members[0].name} ${actor.name} ${actor.members[1].name}`
  },
});

world.addRule({
  cause: {
    type: [life, c.ENCOUNTER, quiet(spirit)],
    template: [c.SOURCE, 'approaches', c.TARGET],
  },
  consequent: {
    type: [],
    template: [c.SOURCE, 'and', c.TARGET, 'pass eachother quietly'],
  },
  isDirectional: true,
  consequentActor: {
    type: complex(connection),
    name: 'conversing silently with',
    members: [c.SOURCE, c.TARGET],
    lifeTime: 2,
    initializeName: (actor) => {
      return `${actor.members[0].name} ${actor.name} ${actor.members[1].name}`
    } 
  },
});

world.addRule({
  cause: {
    type: [simple(hot(entity)), c.ENCOUNTER, simple(cold(entity))],
    template: [c.SOURCE, 'radiates upon', c.TARGET],
  },
  consequent: {
    type: [],
    template: [c.TARGET, 'begins to crack and melt'],
  },
  isDirectional: true,
  consequentActor: {
    type: loud(complex(entity)),
    name: 'cracking and melting',
    members: [c.SOURCE, c.TARGET],
    lifeTime: 2,
    initializeName: (actor) => `${actor.members[1].name} ${actor.name}`
  }
});


world.addRule({
  cause: {
    type: [entity, c.ENCOUNTER, complex(connection)],
    template: [c.SOURCE, 'discovers', c.TARGET],
  },
  consequent: {
    type: [c.SOURCE, c.MOVE_IN, c.TARGET],
    template: [c.SOURCE, 'observes the patterns of', c.TARGET],
  },
  isDirectional: true,
});

world.addRule({
  cause: {
    type: [entity, c.MOVE_IN, complex(connection)],
    template: [c.SOURCE, 'dwells in the stillness of life'],
  },
  consequent: null,
});

world.addRule({
  cause: {
    type: [jolting(entity), c.ENCOUNTER, outpouring(entity)],
    template: [c.SOURCE, 'glances', c.TARGET],
  },
  consequent: {
    type: [c.SOURCE, c.vanish],
    template: [c.SOURCE, 'flickers away'],
  },
  isDirectional: true,
});

/* eslint-disable no-console */
world.runStory(6);
console.log(world.output);
