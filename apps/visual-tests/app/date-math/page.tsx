import {
  addCalendarMonths,
  createCalendarDate,
  createCalendarDateRange,
  createIntlTimeZoneStrategy,
  createLocalDateTime,
  createWallTime,
  getDateRangeLength,
  getIsoWeek,
} from '@casauran-internal/date-math';

const local = (year: number, month: number, day: number, hour: number, minute: number) =>
  createLocalDateTime(createCalendarDate(year, month, day), createWallTime(hour, minute));

export default function DateMathPage() {
  const monthEnd = addCalendarMonths(createCalendarDate(2024, 1, 31), 1);
  const range = createCalendarDateRange(
    createCalendarDate(2026, 3, 8),
    createCalendarDate(2026, 3, 10),
  );
  const week = getIsoWeek(createCalendarDate(2021, 1, 1));
  const zone = createIntlTimeZoneStrategy('America/New_York');
  const gap = local(2026, 3, 8, 2, 30);
  const overlap = local(2026, 11, 1, 1, 30);

  return (
    <main>
      <h1>Date Math foundation</h1>
      <section aria-label="Date Math server result">
        <p data-testid="date-math-server-probe">server-safe package import from SSR.</p>
        <p data-testid="date-math-month-end">{JSON.stringify(monthEnd)}</p>
        <p data-testid="date-math-range-length">{getDateRangeLength(range)}</p>
        <p data-testid="date-math-iso-week">
          {`${String(week.weekYear)}-W${String(week.week)}-${String(week.weekday)}`}
        </p>
        <p data-testid="date-math-gap">{zone.toInstant(gap)}</p>
        <p data-testid="date-math-gap-earlier">{zone.toInstant(gap, 'earlier')}</p>
        <p data-testid="date-math-overlap">{zone.toInstant(overlap)}</p>
        <p data-testid="date-math-overlap-later">{zone.toInstant(overlap, 'later')}</p>
      </section>
    </main>
  );
}
