import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  createScopedId,
  isControlledValue,
  normalizeIdPart,
  resolveControllableValue,
  resolveStateUpdate,
} from '../../packages/core/src/index.js';
import {
  useControllableState,
  useHydrated,
  useStableId,
} from '../../packages/react/src/state/index.js';

describe('React state foundation core contract', () => {
  it('treats only undefined as uncontrolled', () => {
    expect(isControlledValue(undefined)).toBe(false);
    expect(isControlledValue(null)).toBe(true);
    expect(isControlledValue(false)).toBe(true);
    expect(isControlledValue(0)).toBe(true);
    expect(isControlledValue('')).toBe(true);
  });

  it('resolves controlled and uncontrolled values without truthiness shortcuts', () => {
    expect(resolveControllableValue(false, true)).toBe(false);
    expect(resolveControllableValue(undefined, 'fallback')).toBe('fallback');
  });

  it('resolves replacement and functional updates', () => {
    expect(resolveStateUpdate(4, 2)).toBe(4);
    expect(resolveStateUpdate((previous: number) => previous + 2, 2)).toBe(4);
  });

  it('normalizes generated ID parts deterministically', () => {
    expect(normalizeIdPart(' :R 4: ')).toBe('R-4');
    expect(normalizeIdPart('***')).toBe('id');
    expect(createScopedId(' csn field ', ':R4:')).toBe('csn-field-R4');
  });
});

describe('React state foundation server contract', () => {
  function ServerProbe({ value }: { readonly value?: number | undefined }) {
    const [state] = useControllableState({ value, defaultValue: 3 });
    const hydrated = useHydrated();
    const generatedId = useStableId(undefined, 'probe');
    const explicitId = useStableId('exact-id');
    return (
      <div data-generated-id={generatedId} data-hydrated={String(hydrated)}>
        <span id={explicitId}>{state}</span>
      </div>
    );
  }

  it('server-renders the uncontrolled default and non-hydrated state', () => {
    const markup = renderToString(<ServerProbe />);
    expect(markup).toContain('>3</span>');
    expect(markup).toContain('data-hydrated="false"');
    expect(markup).toContain('data-generated-id="probe-');
  });

  it('server-renders a controlled zero and preserves explicit IDs', () => {
    const markup = renderToString(<ServerProbe value={0} />);
    expect(markup).toContain('id="exact-id"');
    expect(markup).toContain('>0</span>');
  });
});
