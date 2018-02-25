import Actor from '../../components/actor'
import { matchRulesFor } from './story'
import { addPeriod, capitalizeFirst } from './lib/grammar'
import { SOURCE, TARGET, VANISH, MOVE_IN, Event, MOVE_OUT } from '../../components/constants'
import World from '../world'
import Rule from '../../components/rule'
import * as utility from './utility'

const selectAtRandom = (arr: any[]) => {
  return arr[ Math.floor(Math.random() * arr.length) ]
}

/*
 * Replaces the constants SOURCE and TARGET with the IDs of the actors that
 * triggered this rule
 */
export function populateTemplate(eventTemplate, actorOne: Actor, actorTwo?: Actor) {
  if (!eventTemplate || !eventTemplate.length) return false;

  return eventTemplate.map(value => {
    if (value === SOURCE) {
      return actorOne.id;
    } else if (value === TARGET && actorTwo) {
      return actorTwo.id;
    } else {
      return value;
    }
  });
}

type StoryEvent = [ number, Event, number] | [ number, Event ] | [ number, Event, string ]

export function renderTemplate(world: World, template: any[]) {
  const result = template.map(piece => utility.fetchElement(world, piece));
  const body = result.join(' ');
  if (!body.length) {
    return '';
  }

  return addPeriod(capitalizeFirst(body))
}

export function addConsequentActor(world: World, rule: Rule, actorOne, actorTwo) {
  const consequentActor = new Actor(rule.consequentActor, world, actorOne, actorTwo);
  consequentActor.parentId = rule.id;
  world.addActor(consequentActor);
}

export function applyConsequent(world: World, typeExpression) {
  if (!typeExpression.length || typeExpression[0] === undefined) return false;
  const typeExpressionArray = Array.isArray(typeExpression[0]) ? typeExpression : [typeExpression];
  let result = '';
  typeExpressionArray.forEach((expr: StoryEvent) => {
    switch (expr[1]) {
      case VANISH: { // [ id, VANISH ]
        const actor = expr[0];
        utility.removeActor(world, actor);
        break;
      }
      case MOVE_OUT:
      case MOVE_IN: { // [ id, MOVE_IN, 'location' ]
        const actor = world.getActorById(expr[0]);
        if (actor) {
          actor.location = expr[2];
        }
        break;
      }
      default: { // [ id, SOME_EVENT, id ]
        const source = utility.getActor(world, expr[0]);
        const target = utility.getActor(world, expr[2]);
        const rules = matchRulesFor(world, source, target, expr[1]);
        if (rules && rules.length) {
          /* eslint-disable no-use-before-define */
          const rule = selectAtRandom(rules);
          result = processEvent(world, rule, source, target);
        }
      }
    }
  });
  return result;
}

export function processEvent(world: World, rule: Rule, actorOne: Actor, actorTwo?: Actor) {
  const causeTemplate = populateTemplate(rule.cause.template, actorOne, actorTwo);
  let consequentTemplate = []
  let tertiaryTemplate = false
  if (rule.consequent) {
    consequentTemplate = populateTemplate(rule.consequent.template, actorOne, actorTwo);
    tertiaryTemplate = populateTemplate(rule.consequent.type, actorOne, actorTwo);
  }
  const causeText = causeTemplate ? renderTemplate(world, causeTemplate) : ''
  const consequentText = consequentTemplate ? renderTemplate(world, consequentTemplate) : ''
  const tertiary = tertiaryTemplate ? applyConsequent(world, tertiaryTemplate) : '';

  if (rule.consequentActor) {
    addConsequentActor(world, rule, actorOne, actorTwo);
  }
  if (rule.mutations) {
    rule.mutations(actorOne, actorTwo)
  }
  const result = causeText + consequentText + tertiary;
  return result;
}
