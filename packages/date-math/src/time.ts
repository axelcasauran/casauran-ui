import { addCalendarDays, copyCalendarDate, type CalendarDate } from './calendar.js';

export interface WallTime {
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;
}

export interface LocalDateTime {
  readonly date: CalendarDate;
  readonly time: WallTime;
}

export interface WallTimeAddition {
  readonly time: WallTime;
  readonly dayOffset: number;
}

const MILLISECONDS_PER_DAY = 86_400_000;

const assertIntegerInRange = (
  value: number,
  minimum: number,
  maximum: number,
  name: string,
): void => {
  if (!Number.isInteger(value)) throw new TypeError(`${name} must be an integer`);
  if (value < minimum || value > maximum) {
    throw new RangeError(`${name} must be between ${String(minimum)} and ${String(maximum)}`);
  }
};

export const createWallTime = (hour: number, minute = 0, second = 0, millisecond = 0): WallTime => {
  assertIntegerInRange(hour, 0, 23, 'hour');
  assertIntegerInRange(minute, 0, 59, 'minute');
  assertIntegerInRange(second, 0, 59, 'second');
  assertIntegerInRange(millisecond, 0, 999, 'millisecond');
  return Object.freeze({ hour, minute, second, millisecond });
};

const copyWallTime = (time: WallTime): WallTime => {
  const candidate: unknown = time;
  if (
    candidate === null ||
    typeof candidate !== 'object' ||
    !Object.hasOwn(candidate, 'hour') ||
    !Object.hasOwn(candidate, 'minute') ||
    !Object.hasOwn(candidate, 'second') ||
    !Object.hasOwn(candidate, 'millisecond')
  ) {
    throw new TypeError('time must define own hour, minute, second, and millisecond fields');
  }
  return createWallTime(time.hour, time.minute, time.second, time.millisecond);
};

export const wallTimeToMilliseconds = (time: WallTime): number => {
  const valid = copyWallTime(time);
  return ((valid.hour * 60 + valid.minute) * 60 + valid.second) * 1000 + valid.millisecond;
};

export const millisecondsToWallTime = (milliseconds: number): WallTimeAddition => {
  if (!Number.isSafeInteger(milliseconds)) {
    throw new TypeError('milliseconds must be a safe integer');
  }
  const dayOffset = Math.floor(milliseconds / MILLISECONDS_PER_DAY);
  let remainder = milliseconds - dayOffset * MILLISECONDS_PER_DAY;
  const hour = Math.floor(remainder / 3_600_000);
  remainder -= hour * 3_600_000;
  const minute = Math.floor(remainder / 60_000);
  remainder -= minute * 60_000;
  const second = Math.floor(remainder / 1000);
  const millisecond = remainder - second * 1000;
  return Object.freeze({ time: createWallTime(hour, minute, second, millisecond), dayOffset });
};

export const addWallTime = (time: WallTime, milliseconds: number): WallTimeAddition => {
  if (!Number.isSafeInteger(milliseconds)) {
    throw new TypeError('milliseconds must be a safe integer');
  }
  const current = wallTimeToMilliseconds(time);
  if (!Number.isSafeInteger(current + milliseconds)) {
    throw new RangeError('wall-time result exceeds safe integer arithmetic');
  }
  return millisecondsToWallTime(current + milliseconds);
};

export const createLocalDateTime = (date: CalendarDate, time: WallTime): LocalDateTime =>
  Object.freeze({
    date: copyCalendarDate(date),
    time: copyWallTime(time),
  });

export const addLocalTime = (value: LocalDateTime, milliseconds: number): LocalDateTime => {
  const valid = createLocalDateTime(value.date, value.time);
  const addition = addWallTime(valid.time, milliseconds);
  return createLocalDateTime(addCalendarDays(valid.date, addition.dayOffset), addition.time);
};
