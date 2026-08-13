export type LiveRegionPoliteness = 'polite' | 'assertive' | 'off';
export type LiveRegionRelevant = 'additions' | 'removals' | 'text' | 'all' | 'additions text';

export interface LiveRegionOptions {
  readonly politeness?: LiveRegionPoliteness;
  readonly atomic?: boolean;
  readonly relevant?: LiveRegionRelevant;
}

export interface LiveRegionAttributes {
  readonly 'aria-live': LiveRegionPoliteness;
  readonly 'aria-atomic': 'true' | 'false';
  readonly 'aria-relevant': LiveRegionRelevant;
}

export interface LiveRegionTarget {
  textContent: string | null;
  readonly isConnected?: boolean;
}

export interface LiveRegionController {
  announce(message: string): void;
  clear(): void;
  dispose(): void;
}

export type LiveRegionScheduler = (callback: () => void) => void;

export function getLiveRegionAttributes(options: LiveRegionOptions = {}): LiveRegionAttributes {
  return {
    'aria-live': options.politeness ?? 'polite',
    'aria-atomic': options.atomic === false ? 'false' : 'true',
    'aria-relevant': options.relevant ?? 'additions text',
  };
}

export function createLiveRegionController(
  target: LiveRegionTarget,
  schedule: LiveRegionScheduler = queueMicrotask,
): LiveRegionController {
  let revision = 0;
  let disposed = false;

  return {
    announce(message) {
      const announcementRevision = ++revision;
      target.textContent = '';
      schedule(() => {
        if (!disposed && announcementRevision === revision && target.isConnected !== false) {
          target.textContent = message;
        }
      });
    },
    clear() {
      revision += 1;
      target.textContent = '';
    },
    dispose() {
      disposed = true;
      revision += 1;
      target.textContent = '';
    },
  };
}
