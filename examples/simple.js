const SG = require('../dist/story.js');
const world = new SG.World();
const Actor = SG.Actor;
const Type = SG.Type;
const c = SG.constants;

const person = new Type('person')
const adult = new Type('adult')
const male = new Type('male')
const female = new Type('female')

const man = person.extend(adult).extend(male)
const woman = person.extend(adult).extend(female)

const dave = new Actor({
  type: man,
  name: 'Dave'
})

const linda = new Actor({
  type: woman,
  name: 'Linda'
})

world.addActor([dave, linda])

world.addRule({
  cause: {
    type: [person, c.ENCOUNTER, person],
    template: [c.SOURCE, 'says hello to', c.TARGET],
  },
  consequent: null,
  isDirectional: false,
});

world.addRule({
  cause: {
    type: [man, c.ENCOUNTER, woman],
    template: [c.SOURCE, 'smiles awkwardly at', c.TARGET],
  },
  consequent: null,
  isDirectional: true,
});

world.addRule({
  cause: {
    type: [man, c.ENCOUNTER, woman],
    template: [c.SOURCE, 'waves to', c.TARGET],
  },
  consequent: null,
  isDirectional: true,
});

// world.runStory(3);
// console.log(world.output);
const test = world.testMatches()
console.log(test)