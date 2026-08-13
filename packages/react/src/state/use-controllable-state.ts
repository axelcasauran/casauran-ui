'use client';

import {
  isControlledValue,
  resolveControllableValue,
  resolveStateUpdate,
} from '@casauran-internal/core';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { useCommittedCallback } from './use-committed-callback.js';

export interface UseControllableStateOptions<Value> {
  readonly value?: Value | undefined;
  readonly defaultValue: Value | (() => Value);
  readonly onChange?: ((value: Value) => void) | undefined;
}

export type StateUpdate<Value> = Value | ((previousValue: Value) => Value);

export type ControllableStateResult<Value> = readonly [
  value: Value,
  setValue: (update: StateUpdate<Value>) => void,
];

export function useControllableState<Value>(
  options: UseControllableStateOptions<Value>,
): ControllableStateResult<Value> {
  const [uncontrolledValue, setUncontrolledValue] = useState(options.defaultValue);
  const controlled = isControlledValue(options.value);
  const value = resolveControllableValue(options.value, uncontrolledValue);
  const committedValueRef = useRef(value);
  const controlledRef = useRef(controlled);
  const onChange = useCommittedCallback(options.onChange);

  useLayoutEffect(() => {
    committedValueRef.current = value;
    controlledRef.current = controlled;
  }, [controlled, value]);

  const setValue = useCallback(
    (update: StateUpdate<Value>) => {
      const previousValue = committedValueRef.current;
      const nextValue = resolveStateUpdate(update, previousValue);
      if (Object.is(previousValue, nextValue)) return;

      if (!controlledRef.current) {
        committedValueRef.current = nextValue;
        setUncontrolledValue(nextValue);
      }
      onChange(nextValue);
    },
    [onChange],
  );

  return [value, setValue];
}
