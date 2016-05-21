const includes = require('lodash/includes');
const Type = require('../../../components/type.js');

/**
 * checkTransitionMatch
 *   Checks that a Rule can be caused by a Thing, a Thing is in the correct origin Location, a Thing
 *   is moving to a valid destination Location, and the Action is "move_out".
 *
 * @param  {Rule} rule
 *   The Rule to validate.
 * @param  {Thing} thing
 *   The Thing to validate.
 * @param  {Location[]} locations
 *   All possible Locations.
 * @param  {Action} action
 *   The type of Action.
 * @return {Boolean}
 *   Whether or not the transition is valid.
 */
module.exports = function checkTransitionMatch(rule, thing, locations, action) {
  if (!(thing.location === rule.getTarget())) {
    return false;
  } else if (!includes(locations, rule.getConsequentTarget())) {
    return false;
  } else if (!(rule.getActionType() === action)) {
    return false;
  }
  const ruleSource = rule.getSource();
  return ruleSource instanceof Type
    ? includes(thing.getTypes(), ruleSource.get())
    : ruleSource === thing.id;
}
