const assert = require('assert');
const Rule = require('../../../src/components/rule');
const SG = require('../../../src/main');
const Actor = SG.Actor;
const Type = SG.Type;
const c = SG.constants;

describe('Rule', () => {
  const world = new SG.World();
  const animal = new Type('animal');
  const cat = animal.extend('cat');
  const dog = animal.extend('dog');
  const cute = type => type.extend('cute');
  const fluffy = type => type.extend('fluffy');
  world.addLocation({ name: 'the garden' });
  const Sport = world.addActor(new Actor({
    type: cute(cat),
    name: 'Sport',
    locations: ['the garden'],
  }));
  const Flex = world.addActor(new Actor({
    type: fluffy(dog),
    name: 'Flex',
    locations: ['the garden'],
  }));
  let rule;
  describe('#constructor()', () => {
    it('Creates a new Rule', () => {
      rule = new Rule({
        cause: {
          type: [Sport, c.encounter, Flex],
          value: [c.source, 'trips on', c.target],
        },
        consequent: {
          type: [],
          value: [c.target, 'rolls around'],
        },
        isDirectional: true,
        mutations: null,
        consequentActor: null,
      }, 0);
      assert.deepEqual(rule, {
        cause: {
          type: [
            0,
            'ENCOUNTER',
            1,
          ],
          value: [
            'SOURCE',
            'trips on',
            'TARGET',
          ],
        },
        consequent: {
          type: [],
          value: [
            'TARGET',
            'rolls around',
          ],
        },
        locations: [],
        consequentActor: null,
        id: 0,
        isDirectional: true,
        mutations: null,
      });
    });
  });
  describe('#getSource()', () => {
    it('Returns the ID of the source', () => {
      assert.equal(rule.getSource(), 0);
    });
  });
  describe('#getTarget()', () => {
    it('Returns the ID of the target', () => {
      assert.equal(rule.getTarget(), 1);
    });
  });
  describe('#getConsequentTarget()', () => {
    it('tbh not sure', () => {
      assert.equal(rule.getConsequentTarget(), undefined);
    });
  });
  describe('#getActionType()', () => {
    it('Returns the constant value of the action', () => {
      assert.equal(rule.getActionType(), 'ENCOUNTER');
    });
  });
});
