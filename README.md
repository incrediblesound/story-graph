# story-graph
The Graph that Generates Stories

StoryGraph is a graph designed to generate and narrate the causal interactions between things in a world. The graph can be populated with entities and expressive rules about the interactions between specific entities or different classes of entities. General rules can create new entities in the graph populated with the specific entities that triggered the rule and attributes defined by those entities. Entities have lifetimes and (coming soon) behaviors that trigger events over time.

Story graph is inspired by [progamming interactive worlds with linear logic](http://www.cs.cmu.edu/~cmartens/thesis/) by [Chris Martens](http://www.cs.cmu.edu/~cmartens/index.html) although it doesn't realize any of the specific principles she develops in that thesis.

There is a more or less fleshed out example in ./example.js that produces sometimes surreal interactions in a snowy forest. To run that example, clone the repo and run the example directly with node.js:
```shell
$ node example.js
```
You will see output something like this:
```
The river joins with the shadow for a moment. The river does a whirling dance with the shadow. A bluejay discovers the river dancing with the shadow. A bluejay observes the patterns of the river dancing with the shadow. A bluejay dwells in the stillness of life. A duck approaches the whisper. A duck and the whisper pass eachother quietly.
```

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

Making things is really straightforward. They take a type, which defines what rules they match, and a name which is used to create the narrative output. Things can also be given a lifetime; after the graph goes through a number of time steps equal to the lifetime of a thing, the thing will be removed from the graph. Lifetimes are more useful for consequent things discussed below. Here are some basic examples:
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

Rules are added via the addRule method on the world, and have the following structure:

```javascript
world.addRule({
  cause: { type: [A, B, C], value: [A, B, C]},
  consequent: { type: [A, B, C], value: [A, B, C] },
  isDirectional: boolean,
  consequentThing: {
    type: type,
    name: "name"
  }
})
```
**Cause**    
Cause is a description of the event that triggers the rule. The cause type has the following structure
```javascript
[ (id || type), action, (id || type) ]
```
where id is the id of a thing in the world, action is one of the actions described in ./src/constants.js, and type is an instance of Type. The cause value is an array that can be any mix of strings and references to the source and target things that triggered the rule. Here is an example cause:
```javascript
var c = require('src/constants.js');
{
cause: {
  type: [ dancer, c.encounter, dancer ],
  value: [ c.source, 'dances with', c.target]
}
...
}
```
**consequent**  
The type property of consequent is different from the type property of cause: it is the type of event that is triggered by the rule as a consequence of the rule being matched, kind of like a chain reaction. If you want a rule that results in a thing being removed from the world you can use constants.vanish, but all other action type will simply trigger a search for a matching rule. The value of the consequent is any mix of strings and references to the things that triggered the rule.
```javascript
consequent : {
  type: [ c.source, c.vanish ],
  value: [ c.source, 'disappears into thin air' ]
}
```
**directionality**  
The isDirectional property must be set to tell the graph how to match rules. If this property is set to false then the order of the things will be ignored when finding a match. When the soure and target are qualitatively different things and the action is truly directional you should set this property to true.

**consequent thing**  
We've already seen how a rule can trigger another event, but a rule can also create a new thing in the world. If you want a rule to produce a thing write the things definition in the consequentThing property of the rule. Consequent things have a couple special properties: first they have members. Because the consequent thing is a product of some other set of specific things triggering a rule it makes sense that those things might be involved or compose in some way the consequent thing. Moreover, the name of the consequent thing might involve the names of the things that triggered the rule, so there is an intialize function that takes the world instance as a parameter and can be used to dynamically set thing properties with properties of the members. Here is a full rule example:
```javascript
world.addRule({
  cause: {
    type: [smart(person), c.encounter, smart(person)],
    value: [c.source, 'meets', c.target]
  },
  consequent: {
    type: [],
    value: [c.source, 'and', c.target, 'start chatting']
  },
  isDirectional: false,
  consequentThing: {
    type: casual(discussion(gathering)),
    name: 'having a discussion with',
    members: [c.source, c.target],
    lifeTime: Math.floor(Math.random()*3),
    initialize: function(world){
      this.name = this.members[0]+ ' '+ this.name+ ' '+this.members[1]; 
    }
  }
})

```
If this rule was matched with two things "Bob" and "Tom" it would produce the following output:

"Bob meets Tom. Bob and Tom start chatting."

##Generate Stories

To generate a narrative based on a random series of interactions use the makeStory method on the world object. This method takes a number which determines how many time ticks the graph will run for.
```javascript
var story = world.makeStory(4);
console.log(story); // "Bob meets Tom..."
```

##TODO and possibilities for expansion
1) types should be extended into dynamic attributes
2) consider using NLP library to parse stories and generate worlds
2) should things exist in and move between linked locations?    
3) should things have state?    
4) should the user be able to set specific events to happen at certain time-steps?    
