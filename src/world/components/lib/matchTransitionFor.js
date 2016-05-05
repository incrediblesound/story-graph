'use strict';

const _ = require('lodash');
const c = require('../../../components/constants.js');
const checkTransitionMatch = require('./checkTransitionMatch');

module.exports = function matchTransitionFor(thing, numRules, rules) {
  const potentialLocations = _.without(thing.locations, thing.location);
  const matchedRules = [];
  for(let i = 0; i < numRules; i++) {
    if (checkTransitionMatch(rules[i], thing, potentialLocations, c.move_out)) {
      matchedRules.push(rules[i]);
    }
  }
  return rules.length && rules[Math.floor(Math.random() * rules.length)];
}
