export interface CalendarDate {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export type CalendarOverflow = 'constrain' | 'reject';

export interface IsoWeek {
  readonly weekYear: number;
  readonly week: number;
  readonly weekday: number;
}

const MILLISECONDS_PER_DAY = 86_400_000;

const assertInteger = (value: number, name: string): void => {
  if (!Number.isInteger(value)) throw new TypeError(`${name} must be an integer`);
};

const assertYear = (year: number): void => {
  assertInteger(year, 'year');
  if (year < 1 || year > 9999) throw new RangeError('year must be between 1 and 9999');
};

const utcEpoch = (year: number, month: number, day: number): number => {
  const value = new Date(0);
  value.setUTCHours(0, 0, 0, 0);
  value.setUTCFullYear(year, month - 1, day);
  return value.getTime();
};

export const isLeapYear = (year: number): boolean => {
  assertYear(year);
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

export const getDaysInMonth = (year: number, month: number): number => {
  assertYear(year);
  assertInteger(month, 'month');
  if (month < 1 || month > 12) throw new RangeError('month must be between 1 and 12');
  const lengths = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return lengths[month - 1] as number;
};

export const createCalendarDate = (year: number, month: number, day: number): CalendarDate => {
  const maximumDay = getDaysInMonth(year, month);
  assertInteger(day, 'day');
  if (day < 1 || day > maximumDay) {
    throw new RangeError(`day must be between 1 and ${String(maximumDay)}`);
  }
  return Object.freeze({ year, month, day });
};

export const copyCalendarDate = (date: CalendarDate): CalendarDate => {
  const candidate: unknown = date;
  if (
    candidate === null ||
    typeof candidate !== 'object' ||
    !Object.hasOwn(candidate, 'year') ||
    !Object.hasOwn(candidate, 'month') ||
    !Object.hasOwn(candidate, 'day')
  ) {
    throw new TypeError('date must define own year, month, and day fields');
  }
  return createCalendarDate(date.year, date.month, date.day);
};

export const compareCalendarDates = (left: CalendarDate, right: CalendarDate): number =>
  Math.sign(calendarDateToEpochDay(left) - calendarDateToEpochDay(right));

export const calendarDateToEpochDay = (date: CalendarDate): number => {
  const valid = copyCalendarDate(date);
  return Math.floor(utcEpoch(valid.year, valid.month, valid.day) / MILLISECONDS_PER_DAY);
};

export const epochDayToCalendarDate = (epochDay: number): CalendarDate => {
  assertInteger(epochDay, 'epochDay');
  const value = new Date(epochDay * MILLISECONDS_PER_DAY);
  if (!Number.isFinite(value.getTime()))
    throw new RangeError('epochDay is outside the supported range');
  return createCalendarDate(value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate());
};

export const addCalendarDays = (date: CalendarDate, days: number): CalendarDate => {
  assertInteger(days, 'days');
  return epochDayToCalendarDate(calendarDateToEpochDay(date) + days);
};

const resolveOverflow = (
  year: number,
  month: number,
  day: number,
  overflow: CalendarOverflow,
): CalendarDate => {
  const allowedOverflow: readonly string[] = ['constrain', 'reject'];
  if (!allowedOverflow.includes(overflow)) {
    throw new TypeError('overflow must be constrain or reject');
  }
  const maximumDay = getDaysInMonth(year, month);
  if (overflow === 'reject' && day > maximumDay) {
    throw new RangeError('target month does not contain the source day');
  }
  return createCalendarDate(year, month, Math.min(day, maximumDay));
};

export const addCalendarMonths = (
  date: CalendarDate,
  months: number,
  overflow: CalendarOverflow = 'constrain',
): CalendarDate => {
  const valid = copyCalendarDate(date);
  assertInteger(months, 'months');
  const zeroBasedMonth = valid.year * 12 + valid.month - 1 + months;
  const targetYear = Math.floor(zeroBasedMonth / 12);
  const targetMonth = (((zeroBasedMonth % 12) + 12) % 12) + 1;
  assertYear(targetYear);
  return resolveOverflow(targetYear, targetMonth, valid.day, overflow);
};

export const addCalendarYears = (
  date: CalendarDate,
  years: number,
  overflow: CalendarOverflow = 'constrain',
): CalendarDate => {
  const valid = copyCalendarDate(date);
  assertInteger(years, 'years');
  const targetYear = valid.year + years;
  assertYear(targetYear);
  return resolveOverflow(targetYear, valid.month, valid.day, overflow);
};

export const differenceInCalendarDays = (left: CalendarDate, right: CalendarDate): number =>
  calendarDateToEpochDay(left) - calendarDateToEpochDay(right);

export const getDayOfWeek = (date: CalendarDate): number => {
  const day = new Date(calendarDateToEpochDay(date) * MILLISECONDS_PER_DAY).getUTCDay();
  return day;
};

const assertWeekday = (weekday: number, name: string): void => {
  assertInteger(weekday, name);
  if (weekday < 0 || weekday > 6) throw new RangeError(`${name} must be between 0 and 6`);
};

export const startOfWeek = (date: CalendarDate, firstDayOfWeek = 1): CalendarDate => {
  assertWeekday(firstDayOfWeek, 'firstDayOfWeek');
  const offset = (getDayOfWeek(date) - firstDayOfWeek + 7) % 7;
  return addCalendarDays(date, -offset);
};

export const endOfWeek = (date: CalendarDate, firstDayOfWeek = 1): CalendarDate =>
  addCalendarDays(startOfWeek(date, firstDayOfWeek), 6);

export const getIsoWeek = (date: CalendarDate): IsoWeek => {
  const weekday = getDayOfWeek(date) || 7;
  const thursday = addCalendarDays(date, 4 - weekday);
  const januaryFourth = createCalendarDate(thursday.year, 1, 4);
  const firstThursday = addCalendarDays(januaryFourth, 4 - (getDayOfWeek(januaryFourth) || 7));
  const week = 1 + Math.floor(differenceInCalendarDays(thursday, firstThursday) / 7);
  return Object.freeze({ weekYear: thursday.year, week, weekday });
};
