import { Event, ActorReference } from './constants';
import Type from './type';
import Location from './location';

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
  id: number;
  isDirectional: boolean;
  cause: CausePattern;
  consequent: ConsequentPattern;
  consequentActor: any;
  mutations: () => void;
  locations: Location[];
  
  constructor(data, id) {
    this.id = id;
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
    return this.consequent.type[2];
  }
  getActionType() {
    return this.cause.type[1];
  }
}
