Version 2.1
===========
- Remove "exclude previous" feature in favor of a log of rendered output. If story-graph fails to render unique output ten times in a row it throws an error
- Fix bug where consequent actors were initialized with two of the same actor
- Moved some utility functions onto the World class
- Added a focalizer to limit rule matches to the location of a specific Actor
- updated webpack config and bumped ts-loader version