export type Event =
  'EVENT__REST' |
  'EVENT__MOVE_IN' |
  'EVENT__MOVE_OUT' |
  'EVENT__APPEAR' |
  'EVENT__VANISH' |
  'EVENT__ENCOUNTER';

export type ActorReference =
  'ACTOR_REFERENCE__TARGET' |
  'ACTOR_REFERENCE__SOURCE'

export const MOVE_IN: Event = 'EVENT__MOVE_IN'
export const MOVE_OUT: Event = 'EVENT__MOVE_OUT'
export const APPEAR: Event = 'EVENT__APPEAR'
export const VANISH: Event = 'EVENT__VANISH'
export const ENCOUNTER: Event = 'EVENT__ENCOUNTER'
export const REST: Event = 'EVENT__REST'

export const TARGET: ActorReference = 'ACTOR_REFERENCE__TARGET'
export const SOURCE: ActorReference = 'ACTOR_REFERENCE__SOURCE'
