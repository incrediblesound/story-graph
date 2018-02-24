import Rule from '../../../components/rule'
import Actor from '../../../components/actor'
import World from '../../world'

function includes(arr: any[], item: any) {
  return arr.indexOf(item) !== -1
}

const getLocalRules = (world: World, actor: Actor): Rule[] => {
  return world.rules.filter((rule: Rule) => {
    const isLocalized: boolean = !!rule.locations.length;
    // rule is universal or actorOne is omnipresent
    if (!isLocalized || !actor.location) return true;
    
    return includes(rule.locations, actor.location);
  })
}

export default getLocalRules
