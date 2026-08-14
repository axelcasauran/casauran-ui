export type PresencePhase = 'unmounted' | 'entering' | 'entered' | 'exiting';

export interface PresenceState {
  readonly phase: PresencePhase;
  readonly mounted: boolean;
  readonly revision: number;
}

export function createPresenceState(present: boolean): PresenceState {
  return Object.freeze({
    phase: present ? 'entered' : 'unmounted',
    mounted: present,
    revision: 0,
  });
}

export function transitionPresence(state: PresenceState, present: boolean): PresenceState {
  if (present && (state.phase === 'entered' || state.phase === 'entering')) return state;
  if (!present && (state.phase === 'unmounted' || state.phase === 'exiting')) return state;
  return Object.freeze({
    phase: present ? 'entering' : 'exiting',
    mounted: true,
    revision: state.revision + 1,
  });
}

export function completePresence(state: PresenceState, revision: number): PresenceState {
  if (revision !== state.revision) return state;
  if (state.phase === 'entering') {
    return Object.freeze({ phase: 'entered', mounted: true, revision: state.revision });
  }
  if (state.phase === 'exiting') {
    return Object.freeze({ phase: 'unmounted', mounted: false, revision: state.revision });
  }
  return state;
}
