const Actor = require('../../components/actor.js');
const story = require('./story.js');
const c = require('../../components/constants.js');
const utility = require('./utility.js');

const _ = require('lodash');

/*
 * Replaces the constants SOURCE and TARGET with the IDs of the actors that
 * triggered this rule
 */
function populateRuleType(eventTemplate, eventTrigger) {
  if (!eventTemplate || !eventTemplate.length) return false;

  return eventTemplate.map(value => {
    if (value === c.source) {
      return eventTrigger[0];
    } else if (value === c.target) {
      return eventTrigger[2];
    }
    return value;
  });
}

function processElementValue(world, element) {
  let result = [];
  _.each(element, (el) => {
    let actor = utility.getPiece(world, el);

    if (actor !== undefined) {
      actor = actor.name !== undefined ? actor.name : actor;
      result.push(actor);
    }
  }, this);
  result = _.compact(result);
  let body = result.join(' ');
  if (!body.length) {
    return '';
  }
  body += '. ';
  const head = body[0].toUpperCase();
  const tail = body.substring(1);
  body = head + tail;
  return body;
}

function addConsequentActor(world, rule, storyEvent) {
  const consequentActor = new Actor(rule.consequentActor, storyEvent, world);
  consequentActor.parentId = rule.id;
  world.addActor(consequentActor);
}

function runMutations(world, rule, storyEvent) {
  const source = world.getActorById(storyEvent[0]);
  const target = world.getActorById(storyEvent[2]);
  rule.mutations(source, target);
}

function applyConsequent(world, typeExpression) {
  if (!typeExpression.length || typeExpression[0] === undefined) return false;
  const typeExpressionArray = Array.isArray(typeExpression[0]) ? typeExpression : [typeExpression];
  let result = '';
  _.each(typeExpressionArray, (expr) => {
    switch (expr[1]) {
      case c.vanish: {
        const actor = expr[0];
        utility.removeActor(world, actor);
        break;
      }
      case c.move_in: {
        const actor = world.getActorById(expr[0]);
        actor.location = expr[2];
        break;
      }
      default: {
        const source = utility.getPiece(expr[0]);
        const target = utility.getPiece(expr[2]);
        const rule = story.matchRuleFor(world, source, target, expr[1]);
        if (rule !== undefined) {
          /* eslint-disable no-use-before-define */
          result += processEvent(rule, expr);
        }
      }
    }
  }, this);
  return result;
}

function processEvent(world, rule, storyEvent) {
  const causeType = populateRuleType(rule.cause.template, storyEvent);
  const consequentType = populateRuleType(rule.consequent.template, storyEvent);
  const tertiaryType = populateRuleType(rule.consequent.type, storyEvent);
  const cause = processElementValue(world, causeType);
  const consequent = processElementValue(world, consequentType);
  const tertiary = !!tertiaryType ? applyConsequent(world, tertiaryType) : '';

  if (!!rule.consequentActor) {
    addConsequentActor(world, rule, storyEvent);
  }
  if (!!rule.mutations) {
    runMutations(world, rule, storyEvent);
  }
  const result = cause + consequent + tertiary;
  return result;
}

module.exports = {
  processEvent,
  addConsequentActor,
  runMutations,
  applyConsequent,
  populateRuleType,
  processElementValue,
};
