'use strict';

const without = require('lodash/without');
const c = require('../../../components/constants.js');
const checkTransitionMatch = require('./checkTransitionMatch');

/**
 * matchTransitionFor
 *   If a Thing has multiple Locations, gets a random transition Rule for that Thing when one exists.
 *
 * @param  {Thing} thing
 *   The Thing to find a transition Rule for.
 * @param  {Integer} numRules
 *   The total number of rules in the World.
 * @param  {Array[]} rules
 *   All the Rules in the World.
 * @return {Rule|false}
 *   A random matching Rule or false if none is found.
 */
module.exports = function matchTransitionFor(thing, numRules, rules) {
  const potentialLocations = without(thing.locations, thing.location);
  const matchedRules = rules.filter(rule => {
    return checkTransitionMatch(rule, thing, potentialLocations, c.move_out);
  });
  return !!matchedRules.length && matchedRules[Math.floor(Math.random() * matchedRules.length)];
}
