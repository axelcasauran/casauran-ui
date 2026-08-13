export type StateUpdate<Value> = Value | ((previousValue: Value) => Value);

export function isControlledValue<Value>(value: Value | undefined): value is Value {
  return value !== undefined;
}

export function resolveControllableValue<Value>(
  controlledValue: Value | undefined,
  uncontrolledValue: Value,
): Value {
  return isControlledValue(controlledValue) ? controlledValue : uncontrolledValue;
}

export function resolveStateUpdate<Value>(update: StateUpdate<Value>, previousValue: Value): Value {
  return typeof update === 'function'
    ? (update as (previousValue: Value) => Value)(previousValue)
    : update;
}
