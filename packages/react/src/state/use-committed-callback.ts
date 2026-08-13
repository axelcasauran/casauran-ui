'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';

export function useCommittedCallback<Arguments extends readonly unknown[], Result>(
  callback: ((...arguments_: Arguments) => Result) | undefined,
): (...arguments_: Arguments) => Result | undefined {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...arguments_: Arguments) => callbackRef.current?.(...arguments_), []);
}
