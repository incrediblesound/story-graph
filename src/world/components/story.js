const utility = require('./utility.js');
const c = require('../../components/constants.js');
const Type = require('../../components/type.js');
const getRandomTransition = require('./lib/getRandomTransition');
const _ = require('lodash');

module.exports = {
    checkMatch,
    matchRuleFor,
    twoThings,
    randomMatch
}

function checkMatch(rule, source, target, action){
    var match;
    var ruleSource = rule.getSource();
    var ruleTarget = rule.getTarget();

    var sourceMatch = ruleSource instanceof Type ? contains(source.getTypes(),ruleSource.get()) : ruleSource === source.id;
    var targetMatch = (target === undefined) || (ruleTarget instanceof Type ? contains(target.getTypes(),ruleTarget.get()) : ruleTarget === target.id);

    if(!rule.isDirectional && target !== undefined){

        var flippedSourceMatch = ruleSource instanceof Type ? contains(target.getTypes(),ruleSource.get()) : ruleSource === target.id;
        var flippedTargetMatch = ruleTarget instanceof Type ? contains(source.getTypes(),ruleTarget.get()) : ruleTarget === source.id;

        match = (sourceMatch && targetMatch) || (flippedTargetMatch && flippedSourceMatch);

    } else { match = (sourceMatch && targetMatch); }

    var sourceInTarget = !(target === undefined) && !!target.members && _.where(target.members, {id: source.id}).length;
    var targetInSource = !(target === undefined) && !!source.members && _.where(source.members, {id: target.id}).length;

    if(action !== undefined){

        return match && (rule.getActionType() === action) && !(sourceInTarget || targetInSource);

    } else {

        return match && !(sourceInTarget || targetInSource);
    }

}

function matchRuleFor(world, one, two, action){
    var rules = [];
    for(var i = 0; i < world.numRules; i++){
        var isMatch = checkMatch(world.rules[i], one, two, action);
        if(isMatch){
            rules.push(world.rules[i]);
        }
    }
    if(!rules.length){
        return false;
    } else {
        return rules[Math.floor(Math.random()*rules.length)];
    }
}

function randomMatch(world){
    if(world.numLocations && rollDie() < 1){
        return getRandomTransition(world)
    } else {
        var pair = twoThings(world);
        var one = pair[0], two = pair[1];
        var rule = matchRuleFor(world, one, two, c.encounter);
        if(!rule){
            return false;
        } else {
            return [rule, one, two]
        }
    }
}

function twoThings(world){
    var localSet = [], randomLocation;
    if(world.numLocations){
        while(localSet.length < 2){
            randomLocation = world.locations[Math.floor(Math.random()*world.numLocations)]
            localSet = utility.getLocalSet(world, randomLocation)
        }
    } else {
        localSet = world.things.slice();
    }
    var thingOne = _.first(localSet.splice(Math.floor(Math.random()*localSet.length), 1));
    var thingTwo = _.first(localSet.splice(Math.floor(Math.random()*localSet.length), 1));
    return [thingOne, thingTwo];
}

// special contains for dealing with types
// returns true if all of y are in x
function contains(x, y){
    console.log(x, y)
    var result = true;
    _.each(y, function(item){
        result = result && _.includes(x, item);
    })
    return result;
}

function rollDie(){
    return Math.floor(Math.random() * 7 )
}
