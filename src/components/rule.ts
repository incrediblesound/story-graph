import { Event, ActorReference } from './constants';
import Type from './type';
import Location from './location';
import Actor from './actor';

export type CauseTypeElement = [ Type | number, Event, Type | number ];
export type ConsequentTypeElement = [ ActorReference, Event, string ];
export type TemplateElement = ActorReference | string;

interface CausePattern {
  type: CauseTypeElement,
  template: TemplateElement[],
}

interface ConsequentPattern {
  type: ConsequentTypeElement,
  template: TemplateElement[],
}

export default class Rule {
  cause: CausePattern;
  consequent: null | ConsequentPattern;
  consequentActor: undefined | Actor;
  id: number;
  isDirectional: boolean;
  locations: Location[];
  mutations: (actorOne: Actor, actorTwo?: Actor) => void;
  name?: string;
  
  constructor(data, id) {
    this.id = id;
    this.name = data.name;

    this.isDirectional = data.isDirectional;
    this.cause = data.cause;
    this.consequent = data.consequent;

    this.consequentActor = data.consequentActor;
    this.mutations = data.mutations;

    this.locations = data.locations || [];
  }
  getSource(): Type | number {
    return this.cause.type[0];
  }
  getTarget(): Type | number {
    return this.cause.type[2];
  }
  getConsequentTarget() {
    return this.consequent && this.consequent.type[2];
  }
  getActionType() {
    return this.cause.type[1];
  }
}
