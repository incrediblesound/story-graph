(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("story-graph", [], factory);
	else if(typeof exports === 'object')
		exports["story-graph"] = factory();
	else
		root["story-graph"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
const MOVE_IN = 'EVENT__MOVE_IN';
/* harmony export (immutable) */ __webpack_exports__["MOVE_IN"] = MOVE_IN;

const MOVE_OUT = 'EVENT__MOVE_OUT';
/* harmony export (immutable) */ __webpack_exports__["MOVE_OUT"] = MOVE_OUT;

const APPEAR = 'EVENT__APPEAR';
/* harmony export (immutable) */ __webpack_exports__["APPEAR"] = APPEAR;

const VANISH = 'EVENT__VANISH';
/* harmony export (immutable) */ __webpack_exports__["VANISH"] = VANISH;

const ENCOUNTER = 'EVENT__ENCOUNTER';
/* harmony export (immutable) */ __webpack_exports__["ENCOUNTER"] = ENCOUNTER;

const REST = 'EVENT__REST';
/* harmony export (immutable) */ __webpack_exports__["REST"] = REST;

const TARGET = 'ACTOR_REFERENCE__TARGET';
/* harmony export (immutable) */ __webpack_exports__["TARGET"] = TARGET;

const SOURCE = 'ACTOR_REFERENCE__SOURCE';
/* harmony export (immutable) */ __webpack_exports__["SOURCE"] = SOURCE;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(0);

class Actor {
    constructor(data, world, actorOne, actorTwo) {
        this.type = data.type;
        this.name = data.name;
        this.members = [];
        if (data.locations) {
            this.location = data.location || data.locations[0];
            this.locations = data.locations;
        }
        else {
            this.locations = [];
            this.location = null;
        }
        this.lifeTime = data.lifeTime || 999;
        // this.callback = data.callback || null;
        if (data.members) {
            this.fetchMembers(world, data.members, actorTwo, actorTwo);
        }
        if (data.initializeName) {
            this.name = data.initializeName(this, world);
        }
    }
    fetchMembers(world, members, actorOne, actorTwo) {
        members.forEach((member, idx) => {
            if (member === __WEBPACK_IMPORTED_MODULE_0__constants__["SOURCE"]) {
                this.members[idx] = actorOne;
            }
            else if (member === __WEBPACK_IMPORTED_MODULE_0__constants__["TARGET"]) {
                this.members[idx] = actorTwo;
            }
        });
    }
    hasMember(id) {
        let found = false;
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i].id === id) {
                found = true;
                break;
            }
        }
        return found;
    }
    getTypes() {
        return this.type.get();
    }
    setEntryTime(time) {
        this.entryTime = time;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Actor;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = removeActor;
/* unused harmony export getLocalSet */
/* harmony export (immutable) */ __webpack_exports__["b"] = getActor;
/* harmony export (immutable) */ __webpack_exports__["a"] = fetchElement;
function removeActor(world, id) {
    let index = null;
    for (let i = 0; i < world.actors.length; i++) {
        if (world.actors[i].id === id) {
            index = i;
            break;
        }
    }
    if (index !== null) {
        world.actors.splice(index, 1);
        world.size--;
    }
}
function getLocalSet(world, location) {
    return world.actors.filter(actor => actor.location === location.name);
}
function getActor(world, reference) {
    if (reference === undefined)
        throw new Error('Undefined value in template.');
    if (typeof reference === 'number') {
        return world.getActorById(reference);
    }
    // this is for adding query patterns to a story, probably unnecessary
    // } else if (piece.where !== undefined) {
    //   const property = piece.where[0];
    //   const value = piece.where[1];
    //   for (let i = 0; i < world.size; i++) {
    //     if (world.actors[i][property] === value) {
    //       return world.actors[i];
    //     }
    //   }
    // }
    return false;
}
function fetchElement(world, element) {
    if (typeof element === 'number') {
        const actor = getActor(world, element);
        if (actor) {
            return actor.name;
        }
    }
    else if (typeof element === 'string') {
        return element;
    }
    return '';
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Rule {
    constructor(data, id) {
        this.id = id;
        this.name = data.name;
        this.isDirectional = data.isDirectional;
        this.cause = data.cause;
        this.consequent = data.consequent;
        this.consequentActor = data.consequentActor;
        this.mutations = data.mutations;
        this.locations = data.locations || [];
    }
    getSource() {
        return this.cause.type[0];
    }
    getTarget() {
        return this.cause.type[2];
    }
    getConsequentTarget() {
        return this.consequent && this.consequent.type[2];
    }
    getActionType() {
        return this.cause.type[1];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Rule;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Type {
    constructor(types) {
        this.types = Array.isArray(types) ? types : [types];
    }
    extend(type) {
        const newType = type instanceof Type ? type.get() : [type];
        const currentTypes = this.get();
        const nextTypes = [...currentTypes, ...newType];
        return new Type(nextTypes);
    }
    get() {
        return this.types.slice();
    }
    replace(oldType, newType) {
        const index = this.types.indexOf(oldType);
        if (index < 0) {
            throw new Error(`Tried to replace "${oldType}" in type set not containing ${oldType}.`);
        }
        this.types[index] = newType;
    }
    add(type) {
        this.types.push(type);
    }
    remove(type) {
        this.types.splice(this.types.indexOf(type), 1);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Type;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Location {
    constructor(data) {
        this.name = data.name;
        this.id = data.id;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Location;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export twoActors */
/* harmony export (immutable) */ __webpack_exports__["a"] = checkMatch;
/* harmony export (immutable) */ __webpack_exports__["b"] = matchRuleFor;
/* harmony export (immutable) */ __webpack_exports__["c"] = randomMatch;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_getRandomTransition__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_ruleMatchesActor__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_getLocalRules__ = __webpack_require__(9);



/* HELPERS */
function rollDie() {
    return Math.floor(Math.random() * 7);
}
/* MAIN FUNCTIONS */
const sameLocation = (one, two) => one.location === two.location;
const sameName = (one, two) => one.name === two.name;
function twoActors(world, actor) {
    const actorOne = actor || world.actors[Math.floor(Math.random() * world.actors.length)];
    let localActors;
    if (actorOne.location) {
        localActors = world.actors.filter(actor => sameLocation(actor, actorOne) && !sameName(actor, actorOne));
    }
    else {
        localActors = world.actors.filter(actor => !sameName(actor, actorOne));
    }
    if (!localActors.length) {
        return [actorOne];
    }
    const actorTwo = localActors[Math.floor(Math.random() * localActors.length)];
    return [actorOne, actorTwo];
}
function checkMatch(rule, source, target, action) {
    let match;
    const sourceMatch = Object(__WEBPACK_IMPORTED_MODULE_1__lib_ruleMatchesActor__["a" /* default */])(rule, source, 'source');
    const targetMatch = !target || Object(__WEBPACK_IMPORTED_MODULE_1__lib_ruleMatchesActor__["a" /* default */])(rule, target, 'target');
    if (!rule.isDirectional && target !== undefined) {
        const flippedSourceMatch = Object(__WEBPACK_IMPORTED_MODULE_1__lib_ruleMatchesActor__["a" /* default */])(rule, target, 'source');
        const flippedTargetMatch = Object(__WEBPACK_IMPORTED_MODULE_1__lib_ruleMatchesActor__["a" /* default */])(rule, source, 'target');
        match = (sourceMatch && targetMatch) || (flippedTargetMatch && flippedSourceMatch);
    }
    else {
        match = (sourceMatch && targetMatch);
    }
    /* this code assumes that actors cannot interact with rule that they are a member of.
    I think this may be incorrect so I am commenting it out for now
  
    const sourceInTarget = !!target && target.members && target.hasMember(source.id);
    const targetInSource = !!target && source.members && source.hasMember(target.id);
    */
    if (action !== undefined) {
        return match && rule.getActionType() === action;
        /* && !(sourceInTarget || targetInSource); */
    }
    return match; /* && !(sourceInTarget || targetInSource); */
}
function matchRuleFor(world, actorOne, actorTwo, action) {
    const matchedRules = [];
    const localRules = Object(__WEBPACK_IMPORTED_MODULE_2__lib_getLocalRules__["a" /* default */])(world, actorOne);
    for (let i = 0; i < localRules.length; i++) {
        const currentRule = localRules[i];
        const isMatch = checkMatch(currentRule, actorOne, actorTwo, action);
        if (isMatch) {
            matchedRules.push(currentRule);
        }
    }
    if (!matchedRules.length) {
        return false;
    }
    return matchedRules[Math.floor(Math.random() * matchedRules.length)];
}
function randomMatch(world) {
    // this function checks the random result of rollDie()
    // to occasionally render a location transition
    if (world.numLocations && rollDie() < 2) {
        const randomTransition = Object(__WEBPACK_IMPORTED_MODULE_0__lib_getRandomTransition__["a" /* default */])(world);
        return randomTransition;
    }
    const pair = twoActors(world);
    const [actorOne, actorTwo] = pair;
    const rule = matchRuleFor(world, actorOne, actorTwo);
    if (!rule) {
        return false;
    }
    else if (!actorTwo) {
        return [rule, actorOne];
    }
    else {
        return [rule, actorOne, actorTwo];
    }
}


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ruleMatchesActor__ = __webpack_require__(8);


/**
 * checkTransitionMatch
 *   Checks that a Rule can be caused by an Actor, an Actor is in the correct
 *   origin Location, an Actor is moving to a valid destination Location,
 *   and the Action is "move_out".
 *
 * @param  {Rule} rule
 *   The Rule to validate.
 * @param  {Actor} actor
 *   The Actor to validate.
 * @param  {Location[]} locations
 *   All possible Locations.
 * @param  {Action} action
 *   The type of Action.
 * @return {Boolean}
 *   Whether or not the transition is valid.
 */
const checkTransitionMatch = (rule, actor) => {
    if (rule.getActionType() === __WEBPACK_IMPORTED_MODULE_0__components_constants__["MOVE_OUT"] && rule.getTarget() === actor.location) {
        return Object(__WEBPACK_IMPORTED_MODULE_1__ruleMatchesActor__["a" /* default */])(rule, actor, 'source');
    }
    else {
        return false;
    }
};
/* harmony default export */ __webpack_exports__["a"] = (checkTransitionMatch);
// rule.getActionType === MOVE_OUT && rule.getTarget === actor.location


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_type__ = __webpack_require__(4);

const includes = (set, item) => {
    for (let i = 0; i < set.length; i++) {
        if (set[i] === item) {
            return true;
        }
    }
    return false;
};
const isSubset = (set, valueOrSet) => {
    if (!Array.isArray(valueOrSet)) {
        return includes(set, valueOrSet);
    }
    return set.reduce((acc, curr) => acc && includes(valueOrSet, curr), true);
};
const ruleMatchesActor = (rule, actor, position) => {
    let ruleToken = position === 'source'
        ? rule.getSource()
        : rule.getTarget();
    return ruleToken instanceof __WEBPACK_IMPORTED_MODULE_0__components_type__["a" /* default */]
        ? isSubset(ruleToken.get(), actor.getTypes())
        : ruleToken === actor.id;
};
/* harmony default export */ __webpack_exports__["a"] = (ruleMatchesActor);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function includes(arr, item) {
    return arr.indexOf(item) !== -1;
}
const getLocalRules = (world, actor) => {
    return world.rules.filter((rule) => {
        const isLocalized = !!rule.locations.length;
        // rule is universal or actorOne is omnipresent
        if (!isLocalized || !actor.location)
            return true;
        return includes(rule.locations, actor.location);
    });
};
/* harmony default export */ __webpack_exports__["a"] = (getLocalRules);


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_actor__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_rule__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_type__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_location__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__world_world__ = __webpack_require__(11);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Actor", function() { return __WEBPACK_IMPORTED_MODULE_1__components_actor__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Rule", function() { return __WEBPACK_IMPORTED_MODULE_2__components_rule__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Type", function() { return __WEBPACK_IMPORTED_MODULE_3__components_type__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Location", function() { return __WEBPACK_IMPORTED_MODULE_4__components_location__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "World", function() { return __WEBPACK_IMPORTED_MODULE_5__world_world__["a"]; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "constants", function() { return __WEBPACK_IMPORTED_MODULE_0__components_constants__; });









/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_rule__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_location__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_actor__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_story__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_events__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_time__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_utility__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_lib_getLocalRules__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_lib_checkTransitionMatch__ = __webpack_require__(7);









const unique = (arr) => {
    let box = {};
    arr.forEach(item => box[item] = true);
    return Object.keys(box);
};
class World {
    constructor(options) {
        this.size = 0;
        this.lastId = -1;
        this.actors = [];
        this.numLocations = 0;
        this.locations = [];
        this.numRules = 0;
        this.rules = [];
        this.logEvents = options && options.logEvents;
        this.timeIndex = 1;
        this.timedEvents = {};
        this.output = '';
    }
    addRule(data) {
        const id = this.numRules++;
        this.rules.push(new __WEBPACK_IMPORTED_MODULE_0__components_rule__["a" /* default */](data, id));
        return id;
    }
    addLocation(data) {
        data.id = this.numLocations;
        this.locations.push(new __WEBPACK_IMPORTED_MODULE_1__components_location__["a" /* default */](data));
        this.numLocations++;
    }
    addActor(actor) {
        const add = (actorToAdd) => {
            const id = this.lastId + 1;
            this.lastId = id;
            actorToAdd.id = id;
            actorToAdd.setEntryTime(this.timeIndex);
            this.actors.push(actorToAdd);
            this.size++;
            return id;
        };
        if (Array.isArray(actor)) {
            actor.forEach(item => add.apply(this, [item]));
            return false;
        }
        const id = add.apply(this, [actor]);
        return id;
    }
    getLocationByName(name) {
        for (let i = 0; i < this.locations.length; i++) {
            if (this.locations[i].name === name) {
                return this.locations[i].id;
            }
        }
        return false;
    }
    getLocationById(id) {
        for (let i = 0; i < this.locations.length; i++) {
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
    renderEvent(theStory) {
        let output = '';
        theStory.forEach(storyEvent => {
            const rule = this.findRule(storyEvent);
            if (rule) {
                output += Object(__WEBPACK_IMPORTED_MODULE_4__components_events__["a" /* processEvent */])(this, rule, storyEvent);
            }
        });
        this.output = `${this.output}${output}`;
    }
    randomEvent() {
        let output = '';
        let nextEvent = false;
        let counter = 0;
        while (!nextEvent) {
            counter++;
            if (counter > 100) {
                throw new Error('Couldn\'t find match');
            }
            nextEvent = Object(__WEBPACK_IMPORTED_MODULE_3__components_story__["c" /* randomMatch */])(this);
        }
        if (this.logEvents && nextEvent[0].name) {
            console.log(`Match on rule "${nextEvent[0].name}"`);
        }
        if (nextEvent.length === 2) {
            const [rule, actor] = nextEvent;
            output += Object(__WEBPACK_IMPORTED_MODULE_4__components_events__["a" /* processEvent */])(this, rule, actor);
        }
        else if (nextEvent[2] instanceof __WEBPACK_IMPORTED_MODULE_2__components_actor__["a" /* default */]) {
            const [rule, one, two] = nextEvent;
            output += Object(__WEBPACK_IMPORTED_MODULE_4__components_events__["a" /* processEvent */])(this, rule, one, two);
        }
        this.output = `${this.output}${output}`;
    }
    runStory(steps, theEvents = []) {
        this.registerTimedEvents(theEvents);
        while (this.timeIndex < steps) {
            Object(__WEBPACK_IMPORTED_MODULE_5__components_time__["a" /* advanceTime */])(this);
        }
    }
    registerTimedEvents(theEvents) {
        theEvents.forEach(event => {
            this.timedEvents[event.step] = event.event;
        });
    }
    findRule(piece) {
        const source = Object(__WEBPACK_IMPORTED_MODULE_6__components_utility__["b" /* getActor */])(this, piece[0]);
        const action = piece[1];
        const target = Object(__WEBPACK_IMPORTED_MODULE_6__components_utility__["b" /* getActor */])(this, piece[2]);
        if (source && target) {
            for (let i = 0; i < this.numRules; i++) {
                const current = this.rules[i];
                if (Object(__WEBPACK_IMPORTED_MODULE_3__components_story__["a" /* checkMatch */])(current, source, target, action)) {
                    return current;
                }
            }
        }
        return false;
    }
    testMatches() {
        const results = {};
        this.actors.forEach(actor => {
            results[actor.name] = {};
            if (actor.locations.length) {
                actor.locations.forEach(location => {
                    actor.location = location;
                    this.populateMatchesForActor(actor, results);
                });
            }
            this.populateMatchesForActor(actor, results);
        });
        return results;
    }
    populateMatchesForActor(actor, results) {
        let localActors;
        if (actor.location) {
            localActors = this.actors.filter(actorTwo => actor.location === actorTwo.location && actor.name !== actorTwo.name);
        }
        else {
            localActors = this.actors.filter(actorTwo => actorTwo.name !== actor.name);
        }
        let localRules = Object(__WEBPACK_IMPORTED_MODULE_7__components_lib_getLocalRules__["a" /* default */])(this, actor);
        const transitionRules = this.rules.filter(rule => Object(__WEBPACK_IMPORTED_MODULE_8__components_lib_checkTransitionMatch__["a" /* default */])(rule, actor));
        if (!localActors.length && !results[actor.name]) {
            results[actor.name] = 'ERROR: no local actors';
        }
        else if (!localRules.length && !transitionRules.length && !results[actor.name]) {
            results[actor.name] = 'ERROR: no matching rules';
        }
        else {
            results[actor.name].TRANSITION_RULES = results[actor.name].TRANSITION_RULES
                ? unique(results[actor.name].TRANSITION_RULES.concat(transitionRules.map(r => r.id)))
                : transitionRules.map(r => r.id);
            results[actor.name].INTERACTION_RULES = {};
            localActors.forEach(actorTwo => {
                results[actor.name].INTERACTION_RULES[actorTwo.name] = results[actor.name].INTERACTION_RULES[actorTwo.name] || [];
                localRules.forEach(rule => {
                    const isMatch = Object(__WEBPACK_IMPORTED_MODULE_3__components_story__["a" /* checkMatch */])(rule, actor, actorTwo);
                    if (isMatch && results[actor.name].INTERACTION_RULES[actorTwo.name].indexOf(rule.id) === -1) {
                        results[actor.name].INTERACTION_RULES[actorTwo.name].push(rule.name || rule.id);
                    }
                });
            });
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = World;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__matchTransitionFor__ = __webpack_require__(13);

/**
 * getRandomTransition
 *   Gets a random Actor from a list of all the Actors with multiple possible locations.
 *
 * @param  {World} world
 *   The world to look for actors within.
 * @return {Boolean | [Transition, Actor]}
 *   A Transition and matching Actor that has more than one location.
 */
const getRandomTransition = (world) => {
    const moveableSet = world.actors.filter(actor => actor.locations.length > 1);
    if (!moveableSet.length) {
        throw new Error('You have defined transitions but none of your actors have multiple possible locations.');
    }
    const randomActor = moveableSet[Math.floor(Math.random() * moveableSet.length)];
    const transition = Object(__WEBPACK_IMPORTED_MODULE_0__matchTransitionFor__["a" /* default */])(randomActor, world.rules);
    return transition && [transition, randomActor];
};
/* harmony default export */ __webpack_exports__["a"] = (getRandomTransition);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_src_world_components_lib_checkTransitionMatch__ = __webpack_require__(7);



/**
 * matchTransitionFor
 *   If an Actor has multiple Locations, gets a random transition Rule for that Actor when one
 *   exists.
 *
 * @param  {Actor} actor
 *   The Actor to find a transition Rule for.
 * @param  {Integer} numRules
 *   The total number of rules in the World.
 * @param  {Array[]} rules
 *   All the Rules in the World.
 * @return {Rule|false}
 *   A random matching Rule or false if none is found.
 */
const matchTransitionFor = (actor, rules) => {
  const matchedRules = rules.filter(rule => Object(__WEBPACK_IMPORTED_MODULE_1_src_world_components_lib_checkTransitionMatch__["a" /* default */])(rule, actor));
  return matchedRules.length && matchedRules[Math.floor(Math.random() * matchedRules.length)];
};

/* harmony default export */ __webpack_exports__["a"] = (matchTransitionFor);


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export populateTemplate */
/* unused harmony export renderTemplate */
/* unused harmony export addConsequentActor */
/* unused harmony export applyConsequent */
/* harmony export (immutable) */ __webpack_exports__["a"] = processEvent;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_actor__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__story__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_grammar__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utility__ = __webpack_require__(2);





/*
 * Replaces the constants SOURCE and TARGET with the IDs of the actors that
 * triggered this rule
 */
function populateTemplate(eventTemplate, actorOne, actorTwo) {
    if (!eventTemplate || !eventTemplate.length)
        return false;
    return eventTemplate.map(value => {
        if (value === __WEBPACK_IMPORTED_MODULE_3__components_constants__["SOURCE"]) {
            return actorOne.id;
        }
        else if (value === __WEBPACK_IMPORTED_MODULE_3__components_constants__["TARGET"] && actorTwo) {
            return actorTwo.id;
        }
        else {
            return value;
        }
    });
}
function renderTemplate(world, template) {
    const result = template.map(piece => __WEBPACK_IMPORTED_MODULE_4__utility__["a" /* fetchElement */](world, piece));
    const body = result.join(' ');
    if (!body.length) {
        return '';
    }
    return Object(__WEBPACK_IMPORTED_MODULE_2__lib_grammar__["a" /* addPeriod */])(Object(__WEBPACK_IMPORTED_MODULE_2__lib_grammar__["b" /* capitalizeFirst */])(body));
}
function addConsequentActor(world, rule, actorOne, actorTwo) {
    const consequentActor = new __WEBPACK_IMPORTED_MODULE_0__components_actor__["a" /* default */](rule.consequentActor, world, actorOne, actorTwo);
    consequentActor.parentId = rule.id;
    world.addActor(consequentActor);
}
function applyConsequent(world, typeExpression) {
    if (!typeExpression.length || typeExpression[0] === undefined)
        return false;
    const typeExpressionArray = Array.isArray(typeExpression[0]) ? typeExpression : [typeExpression];
    let result = '';
    typeExpressionArray.forEach((expr) => {
        switch (expr[1]) {
            case __WEBPACK_IMPORTED_MODULE_3__components_constants__["VANISH"]: {
                const actor = expr[0];
                __WEBPACK_IMPORTED_MODULE_4__utility__["c" /* removeActor */](world, actor);
                break;
            }
            case __WEBPACK_IMPORTED_MODULE_3__components_constants__["MOVE_OUT"]:
            case __WEBPACK_IMPORTED_MODULE_3__components_constants__["MOVE_IN"]: {
                const actor = world.getActorById(expr[0]);
                if (actor) {
                    actor.location = expr[2];
                }
                break;
            }
            default: {
                const source = __WEBPACK_IMPORTED_MODULE_4__utility__["b" /* getActor */](world, expr[0]);
                const target = __WEBPACK_IMPORTED_MODULE_4__utility__["b" /* getActor */](world, expr[2]);
                const rule = source && target && Object(__WEBPACK_IMPORTED_MODULE_1__story__["b" /* matchRuleFor */])(world, source, target, expr[1]);
                if (rule) {
                    /* eslint-disable no-use-before-define */
                    result = processEvent(world, rule, source, target);
                }
            }
        }
    });
    return result;
}
function processEvent(world, rule, actorOne, actorTwo) {
    const causeTemplate = populateTemplate(rule.cause.template, actorOne, actorTwo);
    let consequentTemplate = [];
    let tertiaryTemplate = false;
    if (rule.consequent) {
        consequentTemplate = populateTemplate(rule.consequent.template, actorOne, actorTwo);
        tertiaryTemplate = populateTemplate(rule.consequent.type, actorOne, actorTwo);
    }
    const causeText = causeTemplate ? renderTemplate(world, causeTemplate) : '';
    const consequentText = consequentTemplate ? renderTemplate(world, consequentTemplate) : '';
    const tertiary = tertiaryTemplate ? applyConsequent(world, tertiaryTemplate) : '';
    if (rule.consequentActor) {
        addConsequentActor(world, rule, actorOne, actorTwo);
    }
    if (rule.mutations) {
        rule.mutations(actorOne, actorTwo);
    }
    const result = causeText + consequentText + tertiary;
    return result;
}


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = addPeriod;
/* harmony export (immutable) */ __webpack_exports__["b"] = capitalizeFirst;
function addPeriod(text) {
  return `${text}. `
}

function capitalizeFirst(text) {
  const head = text[0].toUpperCase()
  const tail = text.substring(1)
  return head + tail
}


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = advanceTime;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utility__ = __webpack_require__(2);

function advanceTime(world) {
    if (world.timedEvents[world.timeIndex] !== undefined) {
        world.renderEvent([world.timedEvents[world.timeIndex]]);
    }
    else {
        world.randomEvent();
    }
    world.actors.forEach((actor, idx) => {
        if (idx >= world.size)
            return;
        const age = world.timeIndex - actor.entryTime;
        if (age > actor.lifeTime) {
            Object(__WEBPACK_IMPORTED_MODULE_0__utility__["c" /* removeActor */])(world, actor.id);
        }
        // } else if (actor.callback !== null) {
        // world.processTimeTrigger(world, actor.callback(world.timeIndex));
        // }
    });
    world.timeIndex++;
}


/***/ })
/******/ ]);
});