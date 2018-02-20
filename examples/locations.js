const SG = require('../dist/story.js');
const Actor = SG.Actor;
const Type = SG.Type;
const c = SG.constants;

const world = new SG.World({
  logEvents: true
});


const person = new Type('person')
const adult = new Type('adult')
const male = new Type('male')

const man = person.extend(adult).extend(male)

const dave = new Actor({
  type: man,
  name: 'Dave',
  locations: ['house', 'field']
})

world.addActor(dave)
world.addLocation({ name: 'house' })
world.addLocation({ name: 'field' })

world.addRule({
  name: 'move out:house',
  cause: {
    type: [person, c.MOVE_OUT, 'house'],
    template: [],
  },
  consequent: {
    type: [c.SOURCE, c.MOVE_IN, 'field'],
    template: [c.SOURCE, 'walks out into the field']
  },
  isDirectional: true,
});

world.addRule({
  name: 'move:out field',
  cause: {
    type: [person, c.MOVE_OUT, 'field'],
    template: [],
  },
  consequent: {
    type: [c.SOURCE, c.MOVE_IN, 'house'],
    template: [c.SOURCE, 'goes back into the house']
  },
  isDirectional: true,
});

world.addRule({
  name: 'rest:house',
  cause: {
    type: [person, c.REST],
    template: [c.SOURCE, 'paces around the house anxiously'],
  },
  locations: ['house'],
  consequent: null,
  isDirectional: true,
});

world.addRule({
  name: 'rest:field',
  cause: {
    type: [person, c.REST],
    template: [c.SOURCE, 'looks up at the vast sky'],
  },
  locations: ['field'],
  consequent: null,
  isDirectional: true,
});

world.runStory(3);
console.log(world.output);