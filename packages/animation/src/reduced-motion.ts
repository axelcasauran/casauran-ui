const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export interface MotionPreferenceEnvironment {
  matchMedia(query: string): MotionPreferenceQuery;
}

export interface MotionPreferenceQuery {
  readonly matches: boolean;
  addEventListener(type: 'change', listener: (event: MediaQueryListEvent) => void): void;
  removeEventListener(type: 'change', listener: (event: MediaQueryListEvent) => void): void;
}

export interface ReducedMotionController {
  readonly reducedMotion: boolean;
  readonly disposed: boolean;
  dispose(): void;
}

export function getReducedMotionPreference(environment: MotionPreferenceEnvironment): boolean {
  return environment.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function createReducedMotionController(
  environment: MotionPreferenceEnvironment,
  onChange: (reducedMotion: boolean) => void,
): ReducedMotionController {
  const query = environment.matchMedia(REDUCED_MOTION_QUERY);
  let reducedMotion = query.matches;
  let disposed = false;
  const handleChange = (event: MediaQueryListEvent) => {
    if (disposed || event.matches === reducedMotion) return;
    reducedMotion = event.matches;
    onChange(reducedMotion);
  };
  query.addEventListener('change', handleChange);

  return {
    get reducedMotion() {
      return reducedMotion;
    },
    get disposed() {
      return disposed;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      query.removeEventListener('change', handleChange);
    },
  };
}
