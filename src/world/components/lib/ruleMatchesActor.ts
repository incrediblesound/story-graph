import Rule from '../../../components/rule'
import Actor from '../../../components/actor'
import Type from '../../../components/type'

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

type Position = 'source' | 'target'

const ruleMatchesActor = (rule: Rule, actor: Actor | undefined, position: Position): boolean => {
  let ruleToken = position === 'source'
    ? rule.getSource()
    : rule.getTarget();
  if (!actor) {
    return !ruleToken
  } else {
    return ruleToken instanceof Type
    ? isSubset(ruleToken.get(), actor.getTypes())
    : ruleToken === actor.id;
  }
}

export default ruleMatchesActor