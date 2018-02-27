Story Grapth 2.0
================

Story graph is one of my favorite side projects but it has been lacking in development activity for quite some time. To remedy this, I've made a number of significant improvements as part of the first version bump for Story-Graph.

Typescript
----------

One of the problems with the original implementation was that the code was hard to follow. I've converted the codebase to Typescript to help clarify the internal APIs and make development easier. There are still a few TS errors that I need to track down and a few types to be added, but the conversion is mostly done.

Improved code
-------------

Many of the subroutines and APIs in Story-Graph were poorly designed, and the first version never really escaped the "proof of concept" phase. I've attempted to improve the entire system by simplifying functions and in general trying to adhere more closely to the single responsibility principle. The result is overall simpler, more readable code.

Match profiling
-------------
I added a method `testMatches` to the `World` class that finds and records every possible match in a particular story. This is important to identify orphan actors or rules that will never produce output. Inspecting the output from `testMatches` gives you a picture of what is possible in your story so that you can make changes to improve the output.

Rule names and logging
----------------------
I added a name property to rules and a simple logger so that rule matches can be logged to the console if desired.

Exclude Previous Match
----------------------
A new options can be passed into the world object to prevent matching the same rule twice in a row.

Basic examples
-------------
I added a couple basic examples to demonstrate as simply as possible how story graph works:
- [Simple example](https://github.com/incrediblesound/story-graph/blob/master/examples/simple.js) demonstrates basic interactions
- [Locations example](https://github.com/incrediblesound/story-graph/blob/master/examples/locations.js) demonstrates the use of locations

Of course, as always there are many areas that can still be improved. If you have any ideas feel free to open issues or make a PR.
