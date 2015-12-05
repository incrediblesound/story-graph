# story-graph
The Graph that Generates Stories

StoryGraph is a graph designed to generate and narrate the causal interactions between things in a world. The graph can be populated with entities and expressive rules about the interactions between specific entities or different classes of entities. General rules can create new entities in the graph populated with the specific entities that triggered the rule and attributes defined by those entities. Entities have lifetimes and (coming soon) behaviors that trigger events over time.

Story graph is inspired by [progamming interactive worlds with linear logic](http://www.cs.cmu.edu/~cmartens/thesis/) by [Chris Martens](http://www.cs.cmu.edu/~cmartens/index.html) although it doesn't realize any of the specific principles she develops in that thesis.

There is a more or less fleshed out example in ./example.js that produces sometimes surreal interactions in a snowy forest.

##Types

The first step is to define types. While it is possible to make rules that apply to specific things, you'll probably want to make general rules that apply to classes of things. First the basics:
```javascript
var Type = require('./src/type.js');

var person = new Type('person');
var adult = person.extend('adult'); // matches both rules for "person" generally and "adult" specifically
var man = adult.extend('male'); // matches rules for "person", "adult" and "man"
```
This is the most straightforward way to do it. I like to make a simple helper that allows me to easily create things with complex types:
```javascript
var extendType = function(typeName){
  return function(type){
    return type.extend(typeName);
  }
}
// now I can do this:
var smart = extendType('smart');
var sneaky = extendType('cunning');
var spy = new Thing({ 
  type: smart(sneaky(person))
  name: 'spy'
  })
```
Another strategy you might want to use is to make every type extend from one base type, called "entity" or something like that, which allows you to match on specific types while ignoring more general types. For example, if everything in the world extends from the "person" type, then you can match on sneaky(person) which will match any sneaky person young or old, male or female.

##Things

Making things is really straightforward. They take a type, which defines what rules they match, and a name which is used to create the narrative output. Here are some examples:
```javascript
var bob = new Thing({
  type: smart(man),
  name: 'Bob'
})

var sally = new Thing({
  type: smart(girl),
  name: 'Sally'
})
```
You can add things to the world one by one or as an array of things. You can save the id things by adding them individually.
```javascript
var World = require('./src/world.js');
var world = new World();

var bobId = world.addThing(bob);
var sallyId = world.addThing(sally);
world.addThing([tim, larry, david, moe]);
```

##Rules

...

```javascript


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
