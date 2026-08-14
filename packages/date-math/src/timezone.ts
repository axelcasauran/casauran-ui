import { createCalendarDate } from './calendar.js';
import { createLocalDateTime, createWallTime, type LocalDateTime } from './time.js';

export type TimeZoneDisambiguation = 'compatible' | 'earlier' | 'later' | 'reject';

export interface ZonedDateTime {
  readonly instantMilliseconds: number;
  readonly timeZone: string;
  readonly offsetMilliseconds: number;
  readonly local: LocalDateTime;
}

export interface TimeZoneStrategy {
  readonly timeZone: string;
  getZonedDateTime(instantMilliseconds: number): ZonedDateTime;
  toInstant(local: LocalDateTime, disambiguation?: TimeZoneDisambiguation): number;
}

const SEARCH_WINDOW = 172_800_000;
const formatterLocale = 'en-US-u-ca-gregory-nu-latn';

const assertInstant = (instantMilliseconds: number): void => {
  if (!Number.isSafeInteger(instantMilliseconds)) {
    throw new TypeError('instantMilliseconds must be a safe integer');
  }
  if (!Number.isFinite(new Date(instantMilliseconds).getTime())) {
    throw new RangeError('instantMilliseconds is outside the Date range');
  }
};

const localEpoch = (local: LocalDateTime): number => {
  const valid = createLocalDateTime(local.date, local.time);
  const value = new Date(0);
  value.setUTCHours(valid.time.hour, valid.time.minute, valid.time.second, valid.time.millisecond);
  value.setUTCFullYear(valid.date.year, valid.date.month - 1, valid.date.day);
  return value.getTime();
};

const createFormatter = (timeZone: string): Intl.DateTimeFormat =>
  new Intl.DateTimeFormat(formatterLocale, {
    timeZone,
    calendar: 'gregory',
    numberingSystem: 'latn',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hourCycle: 'h23',
  });

const readPart = (
  parts: readonly Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): number => {
  const value = parts.find((part) => part.type === type)?.value;
  if (value === undefined || !/^\d+$/u.test(value)) {
    throw new RangeError(`Intl.DateTimeFormat did not provide a numeric ${type} part`);
  }
  return Number(value);
};

const formatLocal = (
  formatter: Intl.DateTimeFormat,
  instantMilliseconds: number,
): LocalDateTime => {
  assertInstant(instantMilliseconds);
  const parts = formatter.formatToParts(new Date(instantMilliseconds));
  return createLocalDateTime(
    createCalendarDate(readPart(parts, 'year'), readPart(parts, 'month'), readPart(parts, 'day')),
    createWallTime(
      readPart(parts, 'hour'),
      readPart(parts, 'minute'),
      readPart(parts, 'second'),
      readPart(parts, 'fractionalSecond'),
    ),
  );
};

const compareLocal = (left: LocalDateTime, right: LocalDateTime): number =>
  Math.sign(localEpoch(left) - localEpoch(right));

const offsetAt = (formatter: Intl.DateTimeFormat, instantMilliseconds: number): number =>
  localEpoch(formatLocal(formatter, instantMilliseconds)) - instantMilliseconds;

const validateDisambiguation = (value: TimeZoneDisambiguation): void => {
  if (!['compatible', 'earlier', 'later', 'reject'].includes(value)) {
    throw new TypeError('disambiguation must be compatible, earlier, later, or reject');
  }
};

export const canonicalizeTimeZone = (timeZone: string): string => {
  if (typeof timeZone !== 'string' || timeZone.trim() === '') {
    throw new TypeError('timeZone must be a nonempty string');
  }
  return new Intl.DateTimeFormat(formatterLocale, { timeZone }).resolvedOptions().timeZone;
};

export const createIntlTimeZoneStrategy = (timeZone: string): TimeZoneStrategy => {
  const canonicalTimeZone = canonicalizeTimeZone(timeZone);
  const formatter = createFormatter(canonicalTimeZone);

  const getZonedDateTime = (instantMilliseconds: number): ZonedDateTime => {
    assertInstant(instantMilliseconds);
    const local = formatLocal(formatter, instantMilliseconds);
    return Object.freeze({
      instantMilliseconds,
      timeZone: canonicalTimeZone,
      offsetMilliseconds: localEpoch(local) - instantMilliseconds,
      local,
    });
  };

  const toInstant = (
    local: LocalDateTime,
    disambiguation: TimeZoneDisambiguation = 'compatible',
  ): number => {
    const valid = createLocalDateTime(local.date, local.time);
    validateDisambiguation(disambiguation);
    const target = localEpoch(valid);
    const offsets = new Set<number>();
    for (const probe of [target - SEARCH_WINDOW, target, target + SEARCH_WINDOW]) {
      offsets.add(offsetAt(formatter, probe));
    }
    for (const offset of [...offsets]) {
      const candidate = target - offset;
      offsets.add(offsetAt(formatter, candidate - SEARCH_WINDOW));
      offsets.add(offsetAt(formatter, candidate));
      offsets.add(offsetAt(formatter, candidate + SEARCH_WINDOW));
    }

    const projections = [...offsets]
      .map((offset) => {
        const instant = target - offset;
        return { instant, local: formatLocal(formatter, instant) };
      })
      .filter(
        (entry, index, entries) =>
          entries.findIndex((candidate) => candidate.instant === entry.instant) === index,
      );
    const exact = projections
      .filter((entry) => compareLocal(entry.local, valid) === 0)
      .map((entry) => entry.instant)
      .sort((left, right) => left - right);

    if (exact.length > 0) {
      if (disambiguation === 'reject' && exact.length !== 1) {
        throw new RangeError('local date-time is ambiguous in this time zone');
      }
      return disambiguation === 'later' ? (exact.at(-1) as number) : (exact[0] as number);
    }
    if (disambiguation === 'reject') {
      throw new RangeError('local date-time does not exist in this time zone');
    }

    const ordered = projections.sort(
      (left, right) => localEpoch(left.local) - localEpoch(right.local),
    );
    const earlier = ordered.filter((entry) => compareLocal(entry.local, valid) < 0).at(-1);
    const later = ordered.find((entry) => compareLocal(entry.local, valid) > 0);
    const selected = disambiguation === 'earlier' ? earlier : later;
    if (selected === undefined) {
      throw new RangeError('time-zone transition could not be resolved');
    }
    return selected.instant;
  };

  return Object.freeze({ timeZone: canonicalTimeZone, getZonedDateTime, toInstant });
};
