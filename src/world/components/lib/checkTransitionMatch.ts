import Rule from '../../../components/rule'
import Actor from '../../../components/actor'
import { MOVE_OUT } from '../../../components/constants'

import ruleMatchesActor from './ruleMatchesActor'

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

const checkTransitionMatch = (
  rule: Rule, 
  actor: Actor, 
): boolean => {
  if (rule.getActionType() === MOVE_OUT && rule.getTarget() === actor.location) {
    return ruleMatchesActor(rule, actor, 'source')
  } else {
    return false;
  }
};

export default checkTransitionMatch


// rule.getActionType === MOVE_OUT && rule.getTarget === actor.location