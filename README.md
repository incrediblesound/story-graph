# story-graph
The Graph that Generates Stories

StoryGraph is a graph designed to generate and narrate the causal interactions between things in a world. The features are currently being designed and implemented, but the goal is to be able to populate the graph with entities and then to be able to define highly expressive rules about the interactions between entities and different classes of entities. Generalized interaction rules can create entities in the graph with attributes specific to the entities that triggered the rule, and entities can have lifetimes and behaviors that trigger events over time.

You start with some types:
```javascript
var Type = require('./src/type.js');

var charge = new Type('charged');
var positive = charge.extend('positive');
var negative = charge.extend('negative');

var explosion = new Type('explosion');
```
Then add some things to the world:
```javascript
var World = require('./src/world');

var world = new World();

var bob = new Thing({
  type: positive,
  name: 'Bob'
})

var tim = new Thing({
  type: negative,
  name: 'Tim'
})

var observer = new Thing({
  type: charge,
  name: 'Gasp'
})

var bobId = world.addThing(bob);
var timId = world.addThing(tim);
var observerId = world.addThing(observer);
```
Then add rules about how things interact:
```javascript
var c = require('./src/constants.js');

var explode = world.addRule({
  cause:{
    type: [ negative, c.relations.encounter, positive ],
    value: [ c.events.source, 'interacts with', c.events.target ]
  },
  consequent: {
    type: [[c.events.source, c.relations.vanish],[c.events.target, c.relations.vanish]],
    value: ['they explode']
  },
  isDirectional: false,
  consequentThing: {
    type: explosion,
    name: 'an explosion',
    lifeTime: 1
  }
})
```
