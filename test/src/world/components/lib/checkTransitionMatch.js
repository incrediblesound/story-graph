const assert = require('assert');
const _ = require('lodash');
const checkTransitionMatch
  = require('../../../../../src/world/components/lib/checkTransitionMatch');
const Rule = require('../../../../../src/components/rule');
const SG = require('../../../../../src/main');
const Actor = SG.Actor;
const Type = SG.Type;
const c = SG.constants;

describe('checkTransitionMatch', () => {
  const world = new SG.World();
  const cat = new Type('cat');
  world.addLocation({ name: 'the garden' });
  world.addLocation({ name: 'the shed' });
  const Sport = world.addActor(new Actor({
    type: cat,
    name: 'Sport',
    locations: ['the garden', 'the shed'],
  }));
  const rule = new Rule({
    cause: {
      type: [Sport, c.move_out, 'the garden'],
      value: [],
    },
    consequent: {
      type: [c.source, c.move_in, 'the shed'],
      value: [c.source, 'wanders', 'the shed'],
    },
    isDirectional: true,
    mutations: null,
    consequentActor: null,
  });
  const actor = world.actors[0];
  const locations = _.without(actor.locations, actor.location);
  it('Returns false if the Rule cannot be caused by the Actor', () => {
    const bustedRule = new Rule({
      cause: {
        type: [cat, c.move_in, 'the garden'],
        value: [],
      },
      consequent: {
        type: [c.source, c.move_in, 'the shed'],
        value: [c.source, 'wanders', 'the shed'],
      },
      isDirectional: true,
      mutations: null,
      consequentActor: null,
    });
    assert.deepEqual(checkTransitionMatch(bustedRule, actor, locations, c.move_out), false);
  });
  it('Returns false if the Actor is not in the correct origin Location', () => {
    const actorInShed = Object.assign({}, actor, { location: 'the shed' });
    assert.deepEqual(checkTransitionMatch(rule, actorInShed, ['the garden'], c.move_out), false);
  });
  it('Returns false if the Actor is not moving to the correct destination Location', () => {
    assert.deepEqual(checkTransitionMatch(rule, actor, ['the garden'], c.move_out), false);
  });
  it('Returns false if the Action is not "move_out"', () => {
    assert.deepEqual(checkTransitionMatch(rule, actor, locations, c.encounter), false);
  });
  it('Returns true when every actor is right 😉', () => {
    assert.deepEqual(checkTransitionMatch(rule, actor, locations, c.move_out), true);
  });
});
