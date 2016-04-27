const _ = require('lodash');
const utility = require('./utility.js');

module.exports = {
    advance,
    processTimeTrigger
}

function advance(world){
    world.timeIndex++;
    _.each(world.things, function(thing, idx){
        if(idx >= world.size) return;
        if((world.timeIndex - thing.entryTime) >= thing.lifeTime){
            utility.removeThing(world, thing.id);
        }
        else if(thing.callback !== null){
            world.processTimeTrigger(world, thing.callback(world.timeIndex));
        }
    })
}

function processTimeTrigger(world, timeEvent){
    //do smth
}
