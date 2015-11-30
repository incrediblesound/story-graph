var _ = require('lodash');
var things = require('./things.js');

_.each(things, function(thing){
	console.log(interpretThing(thing));
})


function interpretThing(thing){
	return 'the '+ thing.name;
}