import Actor from '../../components/actor'
import { matchRuleFor } from './story'
import { addPeriod, capitalizeFirst } from './lib/grammar'
import { SOURCE, TARGET, VANISH, MOVE_IN } from '../../components/constants'
import utility from './utility'

/*
 * Replaces the constants SOURCE and TARGET with the IDs of the actors that
 * triggered this rule
 */
export function populateTemplate(eventTemplate, eventTrigger) {
  if (!eventTemplate || !eventTemplate.length) return false;

  return eventTemplate.map(value => {
    if (value === SOURCE) {
      return eventTrigger[0];
    } else if (value === TARGET) {
      return eventTrigger[2];
    }
    return value;
  });
}

export function renderTemplate(world, template) {
  let result = template.map(piece => {
    let actor = utility.getPiece(world, piece);
    let text = actor.name || actor;
    return text;
  });
  let body = result.join(' ');
  if (!body.length) {
    return '';
  }

  return addPeriod(capitalizeFirst(body))
}

export function addConsequentActor(world, rule, storyEvent) {
  const consequentActor = new Actor(rule.consequentActor, storyEvent, world);
  consequentActor.parentId = rule.id;
  world.addActor(consequentActor);
}

export function runMutations(world, rule, storyEvent) {
  const source = world.getActorById(storyEvent[0]);
  const target = world.getActorById(storyEvent[2]);
  rule.mutations(source, target);
}

export function applyConsequent(world, typeExpression) {
  if (!typeExpression.length || typeExpression[0] === undefined) return false;
  const typeExpressionArray = Array.isArray(typeExpression[0]) ? typeExpression : [typeExpression];
  let result = '';
  typeExpressionArray.forEach(expr => {
    switch (expr[1]) {
      case VANISH: {
        const actor = expr[0];
        utility.removeActor(world, actor);
        break;
      }
      case MOVE_IN: {
        const actor = world.getActorById(expr[0]);
        actor.location = expr[2];
        break;
      }
      default: {
        const source = utility.getPiece(expr[0]);
        const target = utility.getPiece(expr[2]);
        const rule = matchRuleFor(world, source, target, expr[1]);
        if (rule !== undefined) {
          /* eslint-disable no-use-before-define */
          result = processEvent(rule, expr);
        }
      }
    }
  }, this);
  return result;
}

export function processEvent(world, rule, storyEvent) {
  const causeTemplate = populateTemplate(rule.cause.template, storyEvent);
  const consequentTemplate = populateTemplate(rule.consequent.template, storyEvent);
  const tertiaryTemplate = populateTemplate(rule.consequent.type, storyEvent);
  const causeText = renderTemplate(world, causeTemplate);
  const consequentText = renderTemplate(world, consequentTemplate);
  const tertiary = !!tertiaryTemplate ? applyConsequent(world, tertiaryTemplate) : '';

  if (!!rule.consequentActor) {
    addConsequentActor(world, rule, storyEvent);
  }
  if (!!rule.mutations) {
    runMutations(world, rule, storyEvent);
  }
  const result = causeText + consequentText + tertiary;
  return result;
}
