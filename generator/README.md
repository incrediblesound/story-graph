#StoryGraph World Generator

The StoryGraph world generator is a program that translates a plain english description of a StoryGraph world into a working StoryGraph program. StoryGraph objects, especially rules, can be cumbersome to write out by hand, so this program allows you to easily define the basic types, rules and things of your world and generate the code automatically. The program generate by the World Generator will be somewhat dull, but since the code is all there it will be easy to go in and make the proper modifications to add color to your StoryGraph world.

##How to Use

First, write a description of your world using the grammar below and save it to disk. Go to the root director of StoryGraph in your console and use the following command:
```shell
node generateWorld path/to/description.txt myWorld.js
```
The second parameter is the output file name and it is important that is has a .js extension. Now you can modify your world as you see fit. Generated worlds automatically console.log a four step story so you can immediately test you world like this:
```shell
node myWorld.js
```

##Grammar

Here is the grammar of the world generator. Note that the formats provided here are not flexible. Only the parts inside curly braces may be replaced with your custom text.

###Basic Types

FORMAT: There is a type called {typename}.  
EXAMPLE: There is a type called person. There is a type called ghost.  

###Type Extensions

FORMAT: A {new type} is a {base type}.  
EXAMPLE: A woman is a person. A cat is an animal. A skeleton is a ghost. 

###Type Decorators

FORMAT: Some things are {typename}.  
OPTIONAL FORMAT: Some things are {type one} and some are {type two}. 
EXAMPLE: Some things are smart and some are stupid. Some things are scary.  

###Things

Note that the placeholder {type} here may be a basic type or extended type preceded by any number of type decorators. See the example for clarification. 

FORMAT: There is a {type} called {name}.  
EXAMPLE: There is a ghost called Slimer. There is a smart kind man named Joe. There is a beautiful woman named Angelina.  

###Rules

Again, the placeholder {type} may be preceded by any number of decorators.

FORMAT: If a {type one} meets a {type two} then the {type one||two} <{text}>.  
OPTIONAL FORMAT: If a {type one} meets a {type two} then the {type one||twp} <{text}> the {type one||two}  
EXAMPLE: If a boy meets a ghost then the boy <starts to cry>. If a man meets a ghost then the man <stares in disbelief at> the ghost.  

##Full Example
Here is a full working example:

There is a type called entity. A person is an entity. A man is a male person. A woman is a female person. A boy is a young man. A girl is a young woman. Some things are intelligent and some are stupid. Some things are friendly and some are rude.

There is a stupid rude man called Joe. There is an intelligent boy called Dave. There is a friendly woman called Susan. There is a girl called Daisy.

If a rude person meets a friendly person then the rude person <is rude to> the friendly person.
If a boy meets a girl then the boy <says "Eeew, girls have cooties!">.