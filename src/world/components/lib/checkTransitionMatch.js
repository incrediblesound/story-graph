const _ = require('lodash');
const Type = require('../../../components/type.js');

module.exports = function checkTransitionMatch(rule, thing, locations, action) {
  const ruleSource = rule.getSource();
  const targetLocation = rule.getConsequentTarget();
  const sourceMatch = ruleSource instanceof Type
    ? _.contains(thing.getTypes(), ruleSource.get())
    : ruleSource === thing.id;
  const originMatch = thing.location === rule.getTarget();
  const destinationMatch = _.contains(locations, targetLocation);
  const actionMatch = rule.getActionType() === action;
  return sourceMatch && destinationMatch && originMatch && actionMatch;
}
