const without = require('lodash/without');
const c = require('../../../components/constants.js');
const checkTransitionMatch = require('./checkTransitionMatch');

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
module.exports = function matchTransitionFor(actor, numRules, rules) {
  const potentialLocations = without(actor.locations, actor.location);
  const matchedRules =
    rules.filter(rule => checkTransitionMatch(rule, actor, potentialLocations, c.move_out));
  return !!matchedRules.length && matchedRules[Math.floor(Math.random() * matchedRules.length)];
};
