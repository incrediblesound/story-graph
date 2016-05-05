const assert = require('assert');
const _ = require('lodash');
const checkTransitionMatch = require('../../../../../src/world/components/lib/checkTransitionMatch');
const Rule = require('../../../../../src/components/rule');
const SG = require('../../../../../src/main');
const world = new SG.World();
const Thing = SG.Thing;
const Type = SG.Type;
const c = SG.constants;

describe('checkTransitionMatch', () => {
  const world = new SG.World();
  const animal = new Type('animal');
  const cat = animal.extend('cat');
  const dog = animal.extend('dog');
  const cute = type => type.extend('cute');
  const fluffy = type => type.extend('fluffy');
  world.addLocation({ name: 'the garden' });
  const Sport = world.addThing(new Thing({
    type: cute(cat),
    name: 'Sport',
    locations: ['the garden']
  }));
  const Flex = world.addThing(new Thing({
    type: fluffy(dog),
    name: 'Flex',
    locations: ['the garden']
  }));
  const rule = new Rule({
    cause: {
      type: [Sport, c.encounter, Flex],
      value: [c.source, 'trips on', c.target]
    },
    consequent: {
      type: [],
      value: [c.target, 'rolls around']
    },
    isDirectional: true,
    mutations: null,
    consequentThing: null
  }, 0);
  const thing = world.things[0];
  const locations = _.without(thing.locations, thing.location)
  it('returns false when ', () => {
    assert.deepEqual(checkTransitionMatch(rule, thing, locations, c.move_out), false);
  });
  it('', () => {
    assert.deepEqual(checkTransitionMatch(rule, thing, locations, c.move_out), true);
  });
});
