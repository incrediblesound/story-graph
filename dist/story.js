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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.MOVE_IN = 'MOVE_IN';
exports.MOVE_OUT = 'MOVE_OUT';
exports.STAY = 'STAY';
exports.APPEAR = 'APPEAR';
exports.VANISH = 'VANISH';
exports.ENCOUNTER = 'ENCOUNTER';
exports.TARGET = 'TARGET';
exports.SOURCE = 'SOURCE';


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var constants_1 = __webpack_require__(0);
var Actor = /** @class */ (function () {
    function Actor(data, storyEvent, world) {
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
        if (storyEvent && world) {
            this.fetchMembers(storyEvent, world, data.members);
        }
        if (data.initializeName) {
            this.name = data.initializeName(this, world);
        }
    }
    Actor.prototype.fetchMembers = function (storyEvent, world, members) {
        var _this = this;
        members.forEach(function (member, idx) {
            if (member === constants_1.SOURCE) {
                _this.members[idx] = world.getActorById(storyEvent[0]);
            }
            else if (member === constants_1.TARGET) {
                _this.members[idx] = world.getActorById(storyEvent[2]);
            }
        });
    };
    Actor.prototype.hasMember = function (id) {
        var found = false;
        for (var i = 0; i < this.members.length; i++) {
            if (this.members[i].id === id) {
                found = true;
                break;
            }
        }
        return found;
    };
    Actor.prototype.getTypes = function () {
        return this.type.get();
    };
    Actor.prototype.setEntryTime = function (time) {
        this.entryTime = time;
    };
    return Actor;
}());
exports["default"] = Actor;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Type = /** @class */ (function () {
    function Type(types) {
        this.types = Array.isArray(types) ? types : [types];
    }
    Type.prototype.extend = function (type) {
        var newType = type instanceof Type ? type.get() : [type];
        var currentTypes = this.get();
        var nextTypes = currentTypes.concat(newType);
        return new Type(nextTypes);
    };
    Type.prototype.get = function () {
        return this.types.slice();
    };
    Type.prototype.replace = function (oldType, newType) {
        var index = this.types.indexOf(oldType);
        if (index < 0) {
            throw new Error("Tried to replace \"" + oldType + "\" in type set not containing " + oldType + ".");
        }
        this.types[index] = newType;
    };
    Type.prototype.add = function (type) {
        this.types.push(type);
    };
    Type.prototype.remove = function (type) {
        this.types.splice(this.types.indexOf(type), 1);
    };
    return Type;
}());
exports["default"] = Type;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
function removeActor(world, id) {
    var index = null;
    for (var i = 0; i < world.actors.length; i++) {
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
exports.removeActor = removeActor;
function getLocalSet(world, location) {
    return world.actors.filter(function (actor) { return actor.location === location.name; });
}
exports.getLocalSet = getLocalSet;
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
exports.getActor = getActor;
function fetchElement(world, element) {
    if (typeof element === 'number') {
        var actor = getActor(world, element);
        if (actor) {
            return actor.name;
        }
    }
    else if (typeof element === 'string') {
        return element;
    }
    return '';
}
exports.fetchElement = fetchElement;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Rule = /** @class */ (function () {
    function Rule(data, id) {
        this.id = id;
        this.isDirectional = data.isDirectional;
        this.cause = data.cause;
        this.consequent = data.consequent;
        this.consequentActor = data.consequentActor;
        this.mutations = data.mutations;
        this.locations = data.locations || [];
    }
    Rule.prototype.getSource = function () {
        return this.cause.type[0];
    };
    Rule.prototype.getTarget = function () {
        return this.cause.type[2];
    };
    Rule.prototype.getConsequentTarget = function () {
        return this.consequent.type[2];
    };
    Rule.prototype.getActionType = function () {
        return this.cause.type[1];
    };
    return Rule;
}());
exports["default"] = Rule;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Location = /** @class */ (function () {
    function Location(data) {
        this.name = data.name;
        this.id = data.id;
    }
    return Location;
}());
exports["default"] = Location;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var constants_1 = __webpack_require__(0);
var type_1 = __webpack_require__(2);
var getRandomTransition_1 = __webpack_require__(9);
var actor_1 = __webpack_require__(1);
/* HELPERS */
function isSubset(set, subset) {
    return subset.reduce(function (acc, curr) { return acc && (set.indexOf(curr) !== -1); }, true);
}
function rollDie() {
    return Math.floor(Math.random() * 7);
}
function includes(arr, item) {
    return arr.indexOf(item) !== -1;
}
/* MAIN FUNCTIONS */
var sameLocation = function (one, two) { return one.location === two.location; };
var sameName = function (one, two) { return one.name === two.name; };
function twoActors(world) {
    var actorOne = world.actors[Math.floor(Math.random() * world.actors.length)];
    var localActors = world.actors.filter(function (actor) {
        return sameLocation(actor, actorOne) && !sameName(actor, actorOne);
    });
    if (!localActors.length) {
        return false;
    }
    var actorTwo = localActors[Math.floor(Math.random() * localActors.length)];
    return [actorOne, actorTwo];
}
exports.twoActors = twoActors;
function checkMatch(rule, source, target, action) {
    var match;
    var ruleSource = rule.getSource();
    var ruleTarget = rule.getTarget();
    var sourceMatch = ruleSource instanceof type_1["default"] && source instanceof actor_1["default"]
        ? isSubset(source.getTypes(), ruleSource.get())
        : ruleSource === source.id;
    var targetMatch = (target === undefined)
        || (ruleTarget instanceof type_1["default"]
            ? isSubset(target.getTypes(), ruleTarget.get())
            : ruleTarget === target.id);
    if (!rule.isDirectional && target !== undefined) {
        var flippedSourceMatch = ruleSource instanceof type_1["default"]
            ? isSubset(target.getTypes(), ruleSource.get())
            : ruleSource === target.id;
        var flippedTargetMatch = ruleTarget instanceof type_1["default"]
            ? isSubset(source.getTypes(), ruleTarget.get())
            : ruleTarget === source.id;
        match = (sourceMatch && targetMatch) || (flippedTargetMatch && flippedSourceMatch);
    }
    else {
        match = (sourceMatch && targetMatch);
    }
    var sourceInTarget = !!target && target.members && target.hasMember(source.id);
    var targetInSource = !!target && source.members && source.hasMember(target.id);
    if (action !== undefined) {
        return match
            && (rule.getActionType() === action)
            && !(sourceInTarget || targetInSource);
    }
    return match && !(sourceInTarget || targetInSource);
}
exports.checkMatch = checkMatch;
function matchRuleFor(world, actorOne, actorTwo, action) {
    var matchedRules = [];
    // create a list of rules that either have no location limitation or whose location
    // limitations contain the location of the two actors
    var localRules = world.rules.filter(function (rule) {
        var hasLocation = !!rule.locations.length;
        // rule is universal or actorOne is omnipresent
        if (!hasLocation || !actorOne.location)
            return true;
        return actorOne.location && (!hasLocation || includes(rule.locations, actorOne.location));
    });
    for (var i = 0; i < localRules.length; i++) {
        var currentRule = localRules[i];
        var isMatch = checkMatch(currentRule, actorOne, actorTwo, action);
        if (isMatch) {
            matchedRules.push(currentRule);
        }
    }
    if (!matchedRules.length) {
        return false;
    }
    return matchedRules[Math.floor(Math.random() * matchedRules.length)];
}
exports.matchRuleFor = matchRuleFor;
function randomMatch(world) {
    // this function checks the random result of rollDie()
    // to occasionally render a location transition
    if (world.numLocations && rollDie() < 2) {
        var randomTransition = getRandomTransition_1["default"](world);
        return randomTransition;
    }
    var pair = twoActors(world);
    if (!pair)
        return false;
    var actorOne = pair[0], actorTwo = pair[1];
    var rule = matchRuleFor(world, actorOne, actorTwo, constants_1.ENCOUNTER);
    if (!rule) {
        return false;
    }
    return [rule, actorOne, actorTwo];
}
exports.randomMatch = randomMatch;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var constants = __webpack_require__(0);
exports.constants = constants;
var actor_1 = __webpack_require__(1);
exports.Actor = actor_1["default"];
var rule_1 = __webpack_require__(4);
exports.Rule = rule_1["default"];
var type_1 = __webpack_require__(2);
exports.Type = type_1["default"];
var location_1 = __webpack_require__(5);
exports.Location = location_1["default"];
var world_1 = __webpack_require__(8);
exports.World = world_1["default"];


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var rule_1 = __webpack_require__(4);
var location_1 = __webpack_require__(5);
var actor_1 = __webpack_require__(1);
var story_1 = __webpack_require__(6);
var events_1 = __webpack_require__(12);
var time_1 = __webpack_require__(14);
var utility_1 = __webpack_require__(3);
var World = /** @class */ (function () {
    function World() {
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
    World.prototype.addRule = function (data) {
        var id = this.numRules++;
        this.rules.push(new rule_1["default"](data, id));
        return id;
    };
    World.prototype.addLocation = function (data) {
        data.id = this.numLocations;
        this.locations.push(new location_1["default"](data));
        this.numLocations++;
    };
    World.prototype.addActor = function (actor) {
        var _this = this;
        function add(actorToAdd) {
            var id = this.lastId + 1;
            this.lastId = id;
            actorToAdd.id = id;
            actorToAdd.setEntryTime(this.timeIndex);
            this.actors.push(actorToAdd);
            this.size++;
            return id;
        }
        if (Array.isArray(actor)) {
            actor.forEach(function (item) { return add.apply(_this, [item]); });
            return false;
        }
        var id = add.apply(this, [actor]);
        return id;
    };
    World.prototype.renderEvent = function (theStory) {
        var _this = this;
        var output = '';
        theStory.forEach(function (storyEvent) {
            var rule = _this.findRule(storyEvent);
            if (rule) {
                output += events_1.processEvent(_this, rule, storyEvent);
            }
        });
        this.output = "" + this.output + output;
    };
    World.prototype.randomEvent = function () {
        var output = '';
        var nextEvent = false;
        var counter = 0;
        while (!nextEvent) {
            counter++;
            if (counter > 100) {
                throw new Error('Couldn\'t find match');
            }
            nextEvent = story_1.randomMatch(this);
        }
        if (nextEvent.length === 2) {
            var rule = nextEvent[0], actor = nextEvent[1];
            output += events_1.processEvent(this, rule, [actor.id, rule.cause.type[1]]);
        }
        else if (nextEvent[2] instanceof actor_1["default"]) {
            var rule = nextEvent[0], one = nextEvent[1], two = nextEvent[2];
            output += events_1.processEvent(this, rule, [one.id, rule.cause.type[1], two.id]);
        }
        this.output = "" + this.output + output;
    };
    World.prototype.runStory = function (steps, theEvents) {
        if (theEvents === void 0) { theEvents = []; }
        this.registerTimedEvents(theEvents);
        while (this.timeIndex < steps) {
            time_1.advanceTime(this);
        }
    };
    World.prototype.registerTimedEvents = function (theEvents) {
        var _this = this;
        theEvents.forEach(function (event) {
            _this.timedEvents[event.step] = event.event;
        });
    };
    World.prototype.findRule = function (piece) {
        var source = utility_1.getActor(this, piece[0]);
        var action = piece[1];
        var target = utility_1.getActor(this, piece[2]);
        if (source && target) {
            for (var i = 0; i < this.numRules; i++) {
                var current = this.rules[i];
                if (story_1.checkMatch(current, source, target, action)) {
                    return current;
                }
            }
        }
        return false;
    };
    World.prototype.getLocationByName = function (name) {
        for (var i = 0; i < this.locations.length; i++) {
            if (this.locations[i].name === name) {
                return this.locations[i].id;
            }
        }
        return false;
    };
    World.prototype.getLocationById = function (id) {
        for (var i = 0; i < this.locations.length; i++) {
            if (this.locations[i].id === id) {
                return this.locations[i];
            }
        }
        return false;
    };
    World.prototype.getActorById = function (id) {
        for (var i = 0; i < this.size; i++) {
            if (this.actors[i].id === id) {
                return this.actors[i];
            }
        }
        return false;
    };
    return World;
}());
exports["default"] = World;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var matchTransitionFor_1 = __webpack_require__(10);
/**
 * getRandomTransition
 *   Gets a random Actor from a list of all the Actors with multiple possible locations.
 *
 * @param  {World} world
 *   The world to look for actors within.
 * @return {Boolean | [Transition, Actor]}
 *   A Transition and matching Actor that has more than one location.
 */
var getRandomTransition = function (world) {
    var moveableSet = world.actors.filter(function (actor) { return actor.locations.length > 1; });
    if (!moveableSet.length) {
        throw new Error('You have defined transitions but none of your actors have multiple possible locations.');
    }
    var randomActor = moveableSet[Math.floor(Math.random() * moveableSet.length)];
    var transition = matchTransitionFor_1["default"](randomActor, world.rules);
    return transition && [transition, randomActor];
};
exports["default"] = getRandomTransition;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_constants___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_constants__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_src_world_components_lib_checkTransitionMatch__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_src_world_components_lib_checkTransitionMatch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_src_world_components_lib_checkTransitionMatch__);



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
  const potentialLocations = actor.locations.filter(l => l !== actor.location);
  const matchedRules =
    rules.filter(rule => __WEBPACK_IMPORTED_MODULE_1_src_world_components_lib_checkTransitionMatch___default()(rule, actor, potentialLocations, __WEBPACK_IMPORTED_MODULE_0__components_constants__["MOVE_OUT"]));
  return matchedRules.length && matchedRules[Math.floor(Math.random() * matchedRules.length)];
};

/* harmony default export */ __webpack_exports__["default"] = (matchTransitionFor);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var type_1 = __webpack_require__(2);
var includes = function (set, item) {
    for (var i = 0; i < set.length; i++) {
        if (set[i] === item) {
            return true;
        }
    }
    return false;
};
var isSubset = function (set, valueOrSet) {
    if (!Array.isArray(valueOrSet)) {
        return includes(set, valueOrSet);
    }
    return set.reduce(function (acc, curr) { return acc && includes(valueOrSet, curr); }, true);
};
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
var checkTransitionMatch = function (rule, actor, locations, action) {
    if (!includes(locations, rule.getConsequentTarget())) {
        return false;
    }
    else if (!(rule.getActionType() === action)) {
        return false;
    }
    var ruleSource = rule.getSource();
    return ruleSource instanceof type_1["default"]
        ? isSubset(actor.getTypes(), ruleSource.get())
        : ruleSource === actor.id;
};
exports["default"] = checkTransitionMatch;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var actor_1 = __webpack_require__(1);
var story_1 = __webpack_require__(6);
var grammar_1 = __webpack_require__(13);
var constants_1 = __webpack_require__(0);
var utility = __webpack_require__(3);
/*
 * Replaces the constants SOURCE and TARGET with the IDs of the actors that
 * triggered this rule
 */
function populateTemplate(eventTemplate, eventTrigger) {
    if (!eventTemplate || !eventTemplate.length)
        return false;
    return eventTemplate.map(function (value) {
        if (value === constants_1.SOURCE) {
            return eventTrigger[0];
        }
        else if (value === constants_1.TARGET) {
            return eventTrigger[2];
        }
        return value;
    });
}
exports.populateTemplate = populateTemplate;
function renderTemplate(world, template) {
    var result = template.map(function (piece) { return utility.fetchElement(world, piece); });
    var body = result.join(' ');
    if (!body.length) {
        return '';
    }
    return grammar_1.addPeriod(grammar_1.capitalizeFirst(body));
}
exports.renderTemplate = renderTemplate;
function addConsequentActor(world, rule, storyEvent) {
    var consequentActor = new actor_1["default"](rule.consequentActor, storyEvent, world);
    consequentActor.parentId = rule.id;
    world.addActor(consequentActor);
}
exports.addConsequentActor = addConsequentActor;
function runMutations(world, rule, storyEvent) {
    var source = world.getActorById(storyEvent[0]);
    var target = world.getActorById(storyEvent[2]);
    rule.mutations(source, target);
}
exports.runMutations = runMutations;
function applyConsequent(world, typeExpression) {
    if (!typeExpression.length || typeExpression[0] === undefined)
        return false;
    var typeExpressionArray = Array.isArray(typeExpression[0]) ? typeExpression : [typeExpression];
    var result = '';
    typeExpressionArray.forEach(function (expr) {
        switch (expr[1]) {
            case constants_1.VANISH: {
                var actor = expr[0];
                utility.removeActor(world, actor);
                break;
            }
            case constants_1.MOVE_IN: {
                var actor = world.getActorById(expr[0]);
                if (actor) {
                    actor.location = expr[2];
                }
                break;
            }
            default: {
                var source = utility.getActor(world, expr[0]);
                var target = utility.getActor(world, expr[2]);
                var rule = source && target && story_1.matchRuleFor(world, source, target, expr[1]);
                if (rule) {
                    /* eslint-disable no-use-before-define */
                    result = processEvent(world, rule, expr);
                }
            }
        }
    }, this);
    return result;
}
exports.applyConsequent = applyConsequent;
function processEvent(world, rule, storyEvent) {
    var causeTemplate = populateTemplate(rule.cause.template, storyEvent);
    var consequentTemplate = populateTemplate(rule.consequent.template, storyEvent);
    var tertiaryTemplate = populateTemplate(rule.consequent.type, storyEvent);
    var causeText = renderTemplate(world, causeTemplate);
    var consequentText = renderTemplate(world, consequentTemplate);
    var tertiary = !!tertiaryTemplate ? applyConsequent(world, tertiaryTemplate) : '';
    if (!!rule.consequentActor) {
        addConsequentActor(world, rule, storyEvent);
    }
    if (!!rule.mutations) {
        runMutations(world, rule, storyEvent);
    }
    var result = causeText + consequentText + tertiary;
    return result;
}
exports.processEvent = processEvent;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["addPeriod"] = addPeriod;
/* harmony export (immutable) */ __webpack_exports__["capitalizeFirst"] = capitalizeFirst;
function addPeriod(text) {
  return `${text}. `
}

function capitalizeFirst(text) {
  const head = text[0].toUpperCase()
  const tail = text.substring(1)
  return head + tail
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var utility_1 = __webpack_require__(3);
function advanceTime(world) {
    if (world.timedEvents[world.timeIndex] !== undefined) {
        world.renderEvent([world.timedEvents[world.timeIndex]]);
    }
    else {
        world.randomEvent();
    }
    world.actors.forEach(function (actor, idx) {
        if (idx >= world.size)
            return;
        var age = world.timeIndex - actor.entryTime;
        if (age > actor.lifeTime) {
            utility_1.removeActor(world, actor.id);
        }
        // } else if (actor.callback !== null) {
        // world.processTimeTrigger(world, actor.callback(world.timeIndex));
        // }
    });
    world.timeIndex++;
}
exports.advanceTime = advanceTime;


/***/ })
/******/ ]);
});