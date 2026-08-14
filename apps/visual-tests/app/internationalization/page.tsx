import {
  compareLocalized,
  createDateTimeFormatter,
  createMessageCatalog,
  createNumberFormatter,
  getLocaleDirection,
  getLocaleFallbackChain,
  resolveMessage,
  selectPluralMessage,
} from '@casauran-internal/i18n';

const catalogs = [
  createMessageCatalog('en', {
    greeting: 'Hello, {name}.',
    unsafe: '<img src=x onerror=alert(1)>',
  }),
  createMessageCatalog('fr', { greeting: 'Bonjour, {name}.' }),
] as const;

export default function InternationalizationPage() {
  const direction = getLocaleDirection('ar-EG');
  const greeting = resolveMessage(catalogs, 'fr-CA', 'greeting', { values: { name: 'Ari' } });
  const unsafe = resolveMessage(catalogs, 'en', 'unsafe');
  const plural = selectPluralMessage('en', 22, { two: 'second', other: 'other' }, 'ordinal');
  const number = createNumberFormatter('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  });
  const date = createDateTimeFormatter('en-GB', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const instant = new Date('2026-01-02T03:04:05.000Z');

  return (
    <main>
      <h1>Internationalization foundation</h1>
      <section aria-label="Internationalization server result" dir={direction}>
        <p data-testid="i18n-server-probe">server-safe package import from SSR.</p>
        <p data-testid="i18n-chain">
          {JSON.stringify(getLocaleFallbackChain('zh-Hant-TW-u-nu-hanidec', 'en-GB'))}
        </p>
        <p data-testid="i18n-direction">{direction}</p>
        <p data-testid="i18n-message">{greeting?.message}</p>
        <p data-testid="i18n-message-locale">{greeting?.locale}</p>
        <p data-testid="i18n-unsafe">{unsafe?.message}</p>
        <p data-testid="i18n-plural">{`${plural.category}:${plural.message}`}</p>
        <p data-testid="i18n-number">{number.format(1234.5)}</p>
        <p data-testid="i18n-number-parts">{JSON.stringify(number.formatToParts(1234.5))}</p>
        <p data-testid="i18n-date">{date.format(instant)}</p>
        <p data-testid="i18n-date-parts">{JSON.stringify(date.formatToParts(instant))}</p>
        <p data-testid="i18n-collation">
          {Math.sign(compareLocalized('2', '10', 'en', { numeric: true }))}
        </p>
      </section>
    </main>
  );
}
