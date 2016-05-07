'use strict';

const _ = require('lodash');
const Type = require('../components/type.js');
const Thing = require('../components/thing.js');
const c = require('../components/constants.js');
const Rule = require('../components/rule.js');
const Location = require('../components/location.js');

const story = require('./components/story.js');
const events = require('./components/events.js');
const time = require('./components/time.js');
const utility = require('./components/utility.js');

class World {
    constructor(){
        this.size = 0;
        this.lastId = -1;
        this.things = [];

        this.numLocations = 0;
        this.locations = [];

        this.numRules = 0;
        this.rules = [];

        this.timeIndex = 1;
        this.timedEvents = {};
        this.output = '';
    }
    addRule(data){
        var id = this.numRules;
        var rule = new Rule(data, id);
        this.rules.push(rule);
        this.numRules++;
        return id;
    }
    addLocation(data){
        data.id = this.numLocations;
        this.locations.push(new Location(data));
        this.numLocations++;
    }
    addThing(thing){
        if(Array.isArray(thing)){
            _.each(thing, function(item){
                add.apply(this, [item]);
            }, this)
        } else {
            var id = add.apply(this, [thing]);
            return id;
        }

        function add(thing){
            var id = this.lastId+1;
            this.lastId = id;
            thing.id = id;
            thing.setEntryTime(this.timeIndex);
            this.things.push(thing);
            this.size++;
            return id;
        }
    }
    renderEvent(story){
        var output = '';
        story.forEach((storyEvent) => {
            const rule = this.findRule(storyEvent);
            output += events.processEvent(this, rule, storyEvent);
        });
        this.output = `${this.output}${output}`;
    }
    randomEvent(){
        var output = '';
        var nextEvent = false, counter = 0;
        while(!nextEvent){
            counter++;
            if(counter > 100) {throw new Error('Couldn\'t find match')}
            nextEvent = story.randomMatch(this);
        }
        if(nextEvent.length === 2){
            var rule = nextEvent[0]
            var thing = nextEvent[1]
            output += events.processEvent(this, rule, [thing.id, rule.cause.type[1]])
        } else {
            var rule = nextEvent[0];
            var one = nextEvent[1];
            var two = nextEvent[2];
            output += events.processEvent(this, rule, [one.id, rule.cause.type[1], two.id]);
        }
        this.output = `${this.output}${output}`;
    }
    runStory(steps, events){
        this.registerTimedEvents(events);
        while(this.timeIndex < steps){
            time.advance(this);
        }
    }
    registerTimedEvents(events){
        events.forEach((event) => {
            this.timedEvents[event.step] = event.event;
        })
    }
    findRule(piece){
        var source = utility.getPiece(this, piece[0]);
        var action = piece[1];
        var target = utility.getPiece(this, piece[2]);
        for(var i = 0; i < this.numRules; i++){
            var current = this.rules[i];
            if(story.checkMatch(current, source, target, action)){
                return current;
            }
        }
        return false;
    }
    getLocationByName(name){
        for(var i = 0; i < this.locations; i++){
            if(this.locations[i].name === name){
                return this.locations[i].id;
            }
        }
    }
    getLocationById(id){
        for(var i = 0; i < this.locations; i++){
            if(this.locations[i].id === id){
                return this.locations[i];
            }
        }
    }
    getThingById(id){
        for(var i = 0; i < this.size; i++){
            if(this.things[i].id === id){
                return this.things[i];
            }
        }
    }
}

module.exports = World;
