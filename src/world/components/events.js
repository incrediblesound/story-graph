const Thing = require('../../components/thing.js');
const story = require('./story.js');
const c = require('../../components/constants.js');
const utility = require('./utility.js');

const _ = require('lodash');

function populateRuleType(world, event, sourceEvent) {
  if (event === undefined || !event.length) return false;

  function swap(val, source) {
    if (val === c.source) {
      return source[0];
    } else if (val === c.target) {
      return source[2];
    }
    return val;
  }

  event[0] = swap(event[0], sourceEvent);
  event[2] = swap(event[2], sourceEvent);
  return event;
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
  const tail = body.substring(1, body.length);
  body = head + tail;
  return body;
}

function addConsequentThing(world, rule, storyEvent) {
  const consequentThing = new Thing(rule.consequentThing, storyEvent, world);
  consequentThing.parentId = rule.id;
  world.addThing(consequentThing);
}

function runMutations(world, rule, storyEvent) {
  const source = world.getThingById(storyEvent[0]);
  const target = world.getThingById(storyEvent[2]);
  rule.mutations(source, target);
}

function applyConsequent(world, typeExpression) {
  if (!typeExpression.length || typeExpression[0] === undefined) return false;
  const typeExpressionArray = Array.isArray(typeExpression[0]) ? typeExpression : [typeExpression];
  let result = '';
  _.each(typeExpressionArray, (expr) => {
    switch (expr[1]) {
      case c.vanish: {
        const thing = expr[0];
        utility.removeThing(world, thing);
        break;
      }
      case c.move_in: {
        const thing = world.getThingById(expr[0]);
        thing.location = expr[2];
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
  const causeType = populateRuleType(world, rule.cause.value.slice(), storyEvent);
  const consequentType = populateRuleType(world, rule.consequent.value.slice(), storyEvent);
  const tertiaryType = populateRuleType(world, rule.consequent.type.slice(), storyEvent);
  const cause = processElementValue(world, causeType);
  const consequent = processElementValue(world, consequentType);
  const tertiary = !!tertiaryType ? applyConsequent(world, tertiaryType) : '';

  if (!!rule.consequentThing) {
    addConsequentThing(world, rule, storyEvent);
  }
  if (!!rule.mutations) {
    runMutations(world, rule, storyEvent);
  }
  const result = cause + consequent + tertiary;
  return result;
}

module.exports = {
  processEvent,
  addConsequentThing,
  runMutations,
  applyConsequent,
  populateRuleType,
  processElementValue,
};
