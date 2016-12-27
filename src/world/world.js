const _ = require('lodash');
const Rule = require('../components/rule.js');
const Location = require('../components/location.js');

const story = require('./components/story.js');
const events = require('./components/events.js');
const time = require('./components/time.js');
const utility = require('./components/utility.js');

class World {
  constructor() {
    this.size = 0;
    this.lastId = -1;
    this.actors = [];

    this.numLocations = 0;
    this.locations = [];

    this.numRules = 0;
    this.rules = [];

    this.timeIndex = 1;
    this.timedEvents = {};
    this.output = '';
  }
  addRule(data) {
    const id = this.numRules;
    const rule = new Rule(data, id);
    this.rules.push(rule);
    this.numRules++;
    return id;
  }
  addLocation(data) {
    data.id = this.numLocations;
    this.locations.push(new Location(data));
    this.numLocations++;
  }
  addActor(actor) {
    function add(actorToAdd) {
      const id = this.lastId + 1;
      this.lastId = id;
      actorToAdd.id = id;
      actorToAdd.setEntryTime(this.timeIndex);
      this.actors.push(actorToAdd);
      this.size++;
      return id;
    }

    if (Array.isArray(actor)) {
      _.each(actor, item => add.apply(this, [item]), this);
      return false;
    }
    const id = add.apply(this, [actor]);
    return id;
  }
  renderEvent(theStory) {
    let output = '';
    theStory.forEach(storyEvent => {
      const rule = this.findRule(storyEvent);
      output += events.processEvent(this, rule, storyEvent);
    });
    this.output = `${this.output}${output}`;
  }
  randomEvent() {
    let output = '';
    let nextEvent = false;
    let counter = 0;
    while (!nextEvent) {
      counter++;
      if (counter > 100) { throw new Error('Couldn\'t find match'); }
      nextEvent = story.randomMatch(this);
    }
    if (nextEvent.length === 2) {
      const rule = nextEvent[0];
      const actor = nextEvent[1];
      output += events.processEvent(this, rule, [actor.id, rule.cause.type[1]]);
    } else {
      const rule = nextEvent[0];
      const one = nextEvent[1];
      const two = nextEvent[2];
      output += events.processEvent(this, rule, [one.id, rule.cause.type[1], two.id]);
    }
    this.output = `${this.output}${output}`;
  }
  runStory(steps, theEvents = []) {
    this.registerTimedEvents(theEvents);
    while (this.timeIndex < steps) {
      time.advance(this);
    }
  }
  registerTimedEvents(theEvents) {
    theEvents.forEach(event => {
      this.timedEvents[event.step] = event.event;
    });
  }
  findRule(piece) {
    const source = utility.getPiece(this, piece[0]);
    const action = piece[1];
    const target = utility.getPiece(this, piece[2]);
    for (let i = 0; i < this.numRules; i++) {
      const current = this.rules[i];
      if (story.checkMatch(current, source, target, action)) {
        return current;
      }
    }
    return false;
  }
  getLocationByName(name) {
    for (let i = 0; i < this.locations; i++) {
      if (this.locations[i].name === name) {
        return this.locations[i].id;
      }
    }
    return false;
  }
  getLocationById(id) {
    for (let i = 0; i < this.locations; i++) {
      if (this.locations[i].id === id) {
        return this.locations[i];
      }
    }
    return false;
  }
  getActorById(id) {
    for (let i = 0; i < this.size; i++) {
      if (this.actors[i].id === id) {
        return this.actors[i];
      }
    }
    return false;
  }
}

module.exports = World;
