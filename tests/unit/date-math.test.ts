import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  addCalendarDays,
  addCalendarMonths,
  addCalendarYears,
  addLocalTime,
  addWallTime,
  clampDateToRange,
  createCalendarDate,
  createCalendarDateRange,
  createIntlTimeZoneStrategy,
  createLocalDateTime,
  createWallTime,
  differenceInCalendarDays,
  endOfWeek,
  getDateRangeLength,
  getDaysInMonth,
  getIsoWeek,
  intersectDateRanges,
  isDateInRange,
  isLeapYear,
  shiftDateRange,
  startOfWeek,
  type CalendarDate,
  type TimeZoneStrategy,
} from '../../packages/date-math/src/index.js';

const local = (year: number, month: number, day: number, hour: number, minute: number) =>
  createLocalDateTime(createCalendarDate(year, month, day), createWallTime(hour, minute));

describe('calendar dates and arithmetic', () => {
  it('validates Gregorian dates, leap years, and immutable typed values', () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(getDaysInMonth(2024, 2)).toBe(29);
    const leapDay = createCalendarDate(2024, 2, 29);
    expect(Object.isFrozen(leapDay)).toBe(true);
    expectTypeOf(leapDay).toEqualTypeOf<CalendarDate>();
    expect(() => createCalendarDate(2023, 2, 29)).toThrow(RangeError);
    expect(() => createCalendarDate(2024, 1, 1.5)).toThrow(TypeError);
    expect(() => createCalendarDate(0, 1, 1)).toThrow(RangeError);
  });

  it('adds calendar units with explicit constrain and reject overflow', () => {
    expect(addCalendarDays(createCalendarDate(2024, 2, 28), 2)).toEqual(
      createCalendarDate(2024, 3, 1),
    );
    expect(addCalendarMonths(createCalendarDate(2023, 1, 31), 1)).toEqual(
      createCalendarDate(2023, 2, 28),
    );
    expect(() => addCalendarMonths(createCalendarDate(2023, 1, 31), 1, 'reject')).toThrow(
      RangeError,
    );
    expect(addCalendarYears(createCalendarDate(2024, 2, 29), 1)).toEqual(
      createCalendarDate(2025, 2, 28),
    );
    expect(
      differenceInCalendarDays(createCalendarDate(2024, 3, 1), createCalendarDate(2024, 2, 28)),
    ).toBe(2);
  });

  it('calculates locale-policy week boundaries and ISO week years', () => {
    const date = createCalendarDate(2021, 1, 1);
    expect(getIsoWeek(date)).toEqual({ weekYear: 2020, week: 53, weekday: 5 });
    expect(startOfWeek(date)).toEqual(createCalendarDate(2020, 12, 28));
    expect(endOfWeek(date)).toEqual(createCalendarDate(2021, 1, 3));
    expect(startOfWeek(date, 0)).toEqual(createCalendarDate(2020, 12, 27));
  });
});

describe('inclusive calendar-date ranges', () => {
  const range = createCalendarDateRange(
    createCalendarDate(2026, 3, 8),
    createCalendarDate(2026, 3, 10),
  );

  it('contains, clamps, intersects, counts, and shifts without mutation', () => {
    expect(getDateRangeLength(range)).toBe(3);
    expect(isDateInRange(createCalendarDate(2026, 3, 8), range)).toBe(true);
    expect(clampDateToRange(createCalendarDate(2026, 3, 1), range)).toEqual(range.start);
    expect(
      intersectDateRanges(
        range,
        createCalendarDateRange(createCalendarDate(2026, 3, 10), createCalendarDate(2026, 3, 12)),
      ),
    ).toEqual(
      createCalendarDateRange(createCalendarDate(2026, 3, 10), createCalendarDate(2026, 3, 10)),
    );
    expect(shiftDateRange(range, 1)).toEqual(
      createCalendarDateRange(createCalendarDate(2026, 3, 9), createCalendarDate(2026, 3, 11)),
    );
    expect(Object.isFrozen(range)).toBe(true);
    expect(() => createCalendarDateRange(range.end, range.start)).toThrow(RangeError);
  });
});

describe('wall time and explicit timezone strategy', () => {
  it('normalizes positive and negative wall-time overflow into calendar dates', () => {
    expect(addWallTime(createWallTime(23, 30), 3_600_000)).toEqual({
      time: createWallTime(0, 30),
      dayOffset: 1,
    });
    expect(addWallTime(createWallTime(0, 15), -3_600_000)).toEqual({
      time: createWallTime(23, 15),
      dayOffset: -1,
    });
    expect(addLocalTime(local(2024, 3, 1, 0, 15), -3_600_000)).toEqual(local(2024, 2, 29, 23, 15));
  });

  it('maps instants in UTC and a non-hour-offset zone without mutable Date output', () => {
    const utc = createIntlTimeZoneStrategy('UTC');
    expectTypeOf(utc).toEqualTypeOf<TimeZoneStrategy>();
    const instant = Date.UTC(2026, 0, 2, 3, 4, 5, 6);
    expect(utc.getZonedDateTime(instant)).toMatchObject({
      instantMilliseconds: instant,
      offsetMilliseconds: 0,
      local: createLocalDateTime(createCalendarDate(2026, 1, 2), createWallTime(3, 4, 5, 6)),
    });
    const kathmandu = createIntlTimeZoneStrategy('Asia/Kathmandu');
    expect(kathmandu.getZonedDateTime(Date.UTC(2026, 0, 1)).offsetMilliseconds).toBe(20_700_000);
    expect(Object.isFrozen(kathmandu)).toBe(true);
  });

  it('uses explicit compatible, earlier, later, and reject DST gap/overlap behavior', () => {
    const zone = createIntlTimeZoneStrategy('America/New_York');
    const gap = local(2026, 3, 8, 2, 30);
    expect(zone.toInstant(gap)).toBe(Date.UTC(2026, 2, 8, 7, 30));
    expect(zone.toInstant(gap, 'earlier')).toBe(Date.UTC(2026, 2, 8, 6, 30));
    expect(() => zone.toInstant(gap, 'reject')).toThrow(RangeError);

    const overlap = local(2026, 11, 1, 1, 30);
    expect(zone.toInstant(overlap)).toBe(Date.UTC(2026, 10, 1, 5, 30));
    expect(zone.toInstant(overlap, 'later')).toBe(Date.UTC(2026, 10, 1, 6, 30));
    expect(() => zone.toInstant(overlap, 'reject')).toThrow(RangeError);
  });

  it('resolves gap and overlap in a half-hour-offset zone with daylight saving', () => {
    // Australia/Adelaide is UTC+09:30 (ACST) and UTC+10:30 (ACDT), so a naive whole-hour offset
    // model produces the wrong instant on both sides of each transition.
    const zone = createIntlTimeZoneStrategy('Australia/Adelaide');
    expect(zone.getZonedDateTime(Date.UTC(2026, 0, 1)).offsetMilliseconds).toBe(37_800_000);
    expect(zone.getZonedDateTime(Date.UTC(2026, 6, 1)).offsetMilliseconds).toBe(34_200_000);

    // Daylight saving ends 5 April 2026: 03:00 ACDT returns to 02:00 ACST, so 02:30 is ambiguous.
    const overlap = local(2026, 4, 5, 2, 30);
    expect(zone.toInstant(overlap)).toBe(Date.UTC(2026, 3, 4, 16, 0));
    expect(zone.toInstant(overlap, 'earlier')).toBe(Date.UTC(2026, 3, 4, 16, 0));
    expect(zone.toInstant(overlap, 'later')).toBe(Date.UTC(2026, 3, 4, 17, 0));
    expect(() => zone.toInstant(overlap, 'reject')).toThrow(RangeError);

    // Daylight saving starts 4 October 2026: 02:00 ACST jumps to 03:00 ACDT, so 02:30 never occurs.
    const gap = local(2026, 10, 4, 2, 30);
    expect(zone.toInstant(gap)).toBe(Date.UTC(2026, 9, 3, 17, 0));
    expect(zone.toInstant(gap, 'earlier')).toBe(Date.UTC(2026, 9, 3, 16, 0));
    expect(() => zone.toInstant(gap, 'reject')).toThrow(RangeError);
  });

  it('rejects malformed structured input and inherited/prototype values safely', () => {
    expect(() => createIntlTimeZoneStrategy('Not/A_Zone')).toThrow(RangeError);
    expect(() => createIntlTimeZoneStrategy('')).toThrow(TypeError);
    const prototype = Object.create({ year: 2026, month: 1, day: 1 }) as CalendarDate;
    expect(() => differenceInCalendarDays(prototype, createCalendarDate(2026, 1, 1))).toThrow();
    expect(() => createWallTime(24)).toThrow(RangeError);
  });
});
