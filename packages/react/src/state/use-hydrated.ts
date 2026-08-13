'use client';

import { createScopedId } from '@casauran-internal/core';
import { useEffect, useId, useState } from 'react';

export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}

export function useStableId(explicitId?: string, prefix = 'csn'): string {
  const generatedId = useId();
  return explicitId ?? createScopedId(prefix, generatedId);
}
