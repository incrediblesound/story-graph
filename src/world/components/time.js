var _ = require('lodash')

module.exports = {
	advance,
	processTimeTrigger
}

function advance(world){
	world.timeIndex++;
	_.each(world.things, function(thing, idx){
		if((world.timeIndex - thing.entryTime) >= thing.lifeTime){
			world.removeThing(thing.id);
		} 
		else if(thing.callback !== null){
			world.processTimeTrigger(world, thing.callback(world.timeIndex));
		}
	})
}

function processTimeTrigger(world, timeEvent){
	//do smth
}