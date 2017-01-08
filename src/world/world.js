import Rule from '../components/rule'
import Location from '../components/location'

import { randomMatch, checkMatch } from './components/story'
import { processEvent } from './components/events'
import { advanceTime } from './components/time'
import { getPiece } from './components/utility'

export default class World {
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
    const id = this.numRules++;
    this.rules.push(new Rule(data, id));
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
      actor.forEach(item => add.apply(this, [item]));
      return false;
    }
    const id = add.apply(this, [actor]);
    return id;
  }
  renderEvent(theStory) {
    let output = '';
    theStory.forEach(storyEvent => {
      const rule = this.findRule(storyEvent);
      output += processEvent(this, rule, storyEvent);
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
      nextEvent = randomMatch(this);
    }
    if (nextEvent.length === 2) {
      const [rule, actor] = nextEvent;
      output += processEvent(this, rule, [actor.id, rule.cause.type[1]]);
    } else {
      const [rule, one, two] = nextEvent;
      output += processEvent(this, rule, [one.id, rule.cause.type[1], two.id]);
    }
    this.output = `${this.output}${output}`;
  }
  runStory(steps, theEvents = []) {
    this.registerTimedEvents(theEvents);
    while (this.timeIndex < steps) {
      advanceTime(this);
    }
  }
  registerTimedEvents(theEvents) {
    theEvents.forEach(event => {
      this.timedEvents[event.step] = event.event;
    });
  }
  findRule(piece) {
    const source = getPiece(this, piece[0]);
    const action = piece[1];
    const target = getPiece(this, piece[2]);
    for (let i = 0; i < this.numRules; i++) {
      const current = this.rules[i];
      if (checkMatch(current, source, target, action)) {
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
