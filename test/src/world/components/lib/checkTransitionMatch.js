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
  const cat = new Type('cat');
  world.addLocation({ name: 'the garden' });
  world.addLocation({ name: 'the shed' });
  const Sport = world.addThing(new Thing({
    type: cat,
    name: 'Sport',
    locations: ['the garden', 'the shed']
  }));
  const rule = new Rule({
    cause: {
      type: [Sport, c.move_out, 'the garden'],
      value: []
    },
    consequent: {
      type: [c.source, c.move_in, 'the shed'],
      value: [c.source, 'wanders', 'the shed']
    },
    isDirectional: true,
    mutations: null,
    consequentThing: null
  });
  const thing = world.things[0];
  const locations = _.without(thing.locations, thing.location);
  it('Returns false if the Rule cannot be caused by the Thing', () => {
    const bustedRule = new Rule({
      cause: {
        type: [cat, c.move_out, 'the garden'],
        value: []
      },
      consequent: {
        type: [c.source, c.move_in, 'the shed'],
        value: [c.source, 'wanders', 'the shed']
      },
      isDirectional: true,
      mutations: null,
      consequentThing: null
    });
    assert.deepEqual(checkTransitionMatch(bustedRule, thing, locations, c.move_out), false);
  });
  it('Returns false if the Thing is not in the correct origin Location', () => {
    const thingInShed = Object.assign({}, thing, { location: 'the shed' });
    assert.deepEqual(checkTransitionMatch(rule, thingInShed, locations, c.move_out), false);
  });
  it('Returns false if the Thing is not moving to the correct destination Location', () => {
    const justTheGarden = ['the garden'];
    assert.deepEqual(checkTransitionMatch(rule, thing, justTheGarden, c.move_out), false);
  });
  it('Returns false if the Action is not "move_out"', () => {
    assert.deepEqual(checkTransitionMatch(rule, thing, locations, c.encounter), false);
  });
  it('Returns true when everything is right 😉', () => {
    assert.deepEqual(checkTransitionMatch(rule, thing, locations, c.move_out), true);
  });
});
