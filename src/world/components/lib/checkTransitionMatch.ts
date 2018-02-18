import Type from 'src/components/type'
import Rule from 'src/components/rule'
import Actor from 'src/components/actor'

const includes = (set: any[], item: any): boolean => {
  for (let i = 0; i < set.length; i++) {
    if (set[i] === item) {
      return true
    }
  }
  return false
}

const isSubset = (set, valueOrSet) => {
  if (!Array.isArray(valueOrSet)) {
    return includes(set, valueOrSet);
  }
  return set.reduce((acc, curr) => acc && includes(valueOrSet, curr), true);
}

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
const checkTransitionMatch = (rule: Rule, actor: Actor, locations: string[], action) => {
  if (!includes(locations, rule.getConsequentTarget())) {
    return false;
  } else if (!(rule.getActionType() === action)) {
    return false;
  }
  const ruleSource = rule.getSource();
  return ruleSource instanceof Type
    ? isSubset(actor.getTypes(), ruleSource.get())
    : ruleSource === actor.id;
};

export default checkTransitionMatch