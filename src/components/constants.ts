export type Event =
  'MOVE_IN' |
  'MOVE_OUT' |
  'STAY' |
  'APPEAR' |
  'VANISH' |
  'ENCOUNTER';

export type ActorReference =
  'TARGET' |
  'SOURCE'

export const MOVE_IN: Event = 'MOVE_IN'
export const MOVE_OUT: Event = 'MOVE_OUT'
export const STAY: Event = 'STAY'
export const APPEAR: Event = 'APPEAR'
export const VANISH: Event = 'VANISH'
export const ENCOUNTER: Event = 'ENCOUNTER'

export const TARGET: ActorReference = 'TARGET'
export const SOURCE: ActorReference = 'SOURCE'
