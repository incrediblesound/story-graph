# story-graph
The Graph that Generates Stories

StoryGraph is a graph designed to generate and narrate the causal interactions between things in a world. The graph can be populated with entities and expressive rules about the interactions between specific entities or different classes of entities. General rules can create new entities in the graph populated with the specific entities that triggered the rule and attributes defined by those entities. Entities have lifetimes and (coming soon) behaviors that trigger events over time.

Story graph is inspired by [progamming interactive worlds with linear logic](http://www.cs.cmu.edu/~cmartens/thesis/) by [Chris Martens](http://www.cs.cmu.edu/~cmartens/index.html) although it doesn't realize any of the specific principles she develops in that thesis.

There is a more or less fleshed out example in ./example.js that produces sometimes surreal interactions in a snowy forest.

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
  // this rule will create an explosion type thing
  consequentThing: {
    type: explosion,
    name: 'an explosion',
    lifeTime: 1
  }
})

// this rule will run any time observer encounters an explosion type thing
var laugh = world.addRule({
	cause: {
		type: [ observerId, c.relations.encounter, explosion ],
		value: [ observerId, 'sees', c.events.target ]
	},
	consequent: {
		type: [observerId, c.relations.stay],
		value: [ observerId, 'laughs at', c.events.target ]
	},
	isDirectional: true
})

```
Then you can make the graph generate random interactions for n number of ticks:
```javascript

console.log(world.makeStory(2));
// outputs something like: "Bob interacts with Tim. they explode. Gasp sees the explosion. Gasp laughs at the explosion."
```
##TODO and possibilities for expansion
1) the graph should check for rules that match consequent types    
2) should things exist in and move between linked locations?    
3) should things have state?    
4) should the user be able to set specific events to happen at certain time-steps?    
