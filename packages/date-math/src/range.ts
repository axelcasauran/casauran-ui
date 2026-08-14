import {
  addCalendarDays,
  compareCalendarDates,
  copyCalendarDate,
  differenceInCalendarDays,
  type CalendarDate,
} from './calendar.js';

export interface CalendarDateRange {
  readonly start: CalendarDate;
  readonly end: CalendarDate;
}

export const createCalendarDateRange = (
  start: CalendarDate,
  end: CalendarDate,
): CalendarDateRange => {
  const validStart = copyCalendarDate(start);
  const validEnd = copyCalendarDate(end);
  if (compareCalendarDates(validStart, validEnd) > 0) {
    throw new RangeError('range start must not be after range end');
  }
  return Object.freeze({ start: validStart, end: validEnd });
};

export const isDateInRange = (date: CalendarDate, range: CalendarDateRange): boolean => {
  const valid = copyCalendarDate(date);
  const normalized = createCalendarDateRange(range.start, range.end);
  return (
    compareCalendarDates(valid, normalized.start) >= 0 &&
    compareCalendarDates(valid, normalized.end) <= 0
  );
};

export const clampDateToRange = (date: CalendarDate, range: CalendarDateRange): CalendarDate => {
  const valid = copyCalendarDate(date);
  const normalized = createCalendarDateRange(range.start, range.end);
  if (compareCalendarDates(valid, normalized.start) < 0) return normalized.start;
  if (compareCalendarDates(valid, normalized.end) > 0) return normalized.end;
  return valid;
};

export const intersectDateRanges = (
  left: CalendarDateRange,
  right: CalendarDateRange,
): CalendarDateRange | undefined => {
  const first = createCalendarDateRange(left.start, left.end);
  const second = createCalendarDateRange(right.start, right.end);
  const start = compareCalendarDates(first.start, second.start) >= 0 ? first.start : second.start;
  const end = compareCalendarDates(first.end, second.end) <= 0 ? first.end : second.end;
  return compareCalendarDates(start, end) <= 0 ? createCalendarDateRange(start, end) : undefined;
};

export const getDateRangeLength = (range: CalendarDateRange): number => {
  const normalized = createCalendarDateRange(range.start, range.end);
  return differenceInCalendarDays(normalized.end, normalized.start) + 1;
};

export const shiftDateRange = (range: CalendarDateRange, days: number): CalendarDateRange => {
  const normalized = createCalendarDateRange(range.start, range.end);
  return createCalendarDateRange(
    addCalendarDays(normalized.start, days),
    addCalendarDays(normalized.end, days),
  );
};
