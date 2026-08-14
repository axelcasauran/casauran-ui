import { canonicalizeLocale, getLocaleFallbackChain } from './locale.js';

export type MessageParameter = string | number | bigint;

export interface MessageCatalog {
  readonly locale: string;
  readonly messages: Readonly<Record<string, string>>;
}

export interface FormatMessageOptions {
  readonly missingVariable?: 'preserve' | 'error';
}

export interface ResolveMessageOptions extends FormatMessageOptions {
  readonly fallbackLocale?: string;
  readonly defaultMessage?: string;
  readonly values?: Readonly<Record<string, MessageParameter>>;
}

export interface ResolvedMessage {
  readonly id: string;
  readonly locale: string;
  readonly message: string;
  readonly source: 'catalog' | 'default';
  readonly usedFallback: boolean;
}

const PLACEHOLDER = /\{([A-Za-z][A-Za-z0-9_.-]*)\}/gu;

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const assertMessageId = (id: string): void => {
  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new TypeError('Message identifier must be a nonempty string');
  }
};

export const createMessageCatalog = (
  locale: string,
  messages: Readonly<Record<string, string>>,
): MessageCatalog => {
  const rawMessages: unknown = messages;
  if (!isRecord(rawMessages)) {
    throw new TypeError('Message catalog must be a record of plain-text messages');
  }
  const entries = Object.entries(rawMessages);
  for (const [id, message] of entries) {
    assertMessageId(id);
    if (typeof message !== 'string') {
      throw new TypeError(`Message ${id} must be a string`);
    }
  }
  const copied = Object.create(null) as Record<string, string>;
  for (const [id, message] of entries) {
    Object.defineProperty(copied, id, {
      configurable: false,
      enumerable: true,
      value: message,
      writable: false,
    });
  }
  Object.freeze(copied);
  return Object.freeze({ locale: canonicalizeLocale(locale), messages: copied });
};

export const formatMessage = (
  message: string,
  values: Readonly<Record<string, MessageParameter>> = {},
  options: FormatMessageOptions = {},
): string => {
  if (typeof message !== 'string') throw new TypeError('Message must be a string');
  const rawValues: unknown = values;
  if (!isRecord(rawValues)) {
    throw new TypeError('Message values must be a record');
  }
  return message.replace(PLACEHOLDER, (placeholder, name: string) => {
    if (!Object.hasOwn(rawValues, name)) {
      if (options.missingVariable === 'error') {
        throw new TypeError(`Missing message value: ${name}`);
      }
      return placeholder;
    }
    const value = rawValues[name];
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'bigint') {
      throw new TypeError(`Message value ${name} must be a string, number, or bigint`);
    }
    return String(value);
  });
};

export const resolveMessage = (
  catalogs: readonly MessageCatalog[],
  locale: string,
  id: string,
  options: ResolveMessageOptions = {},
): ResolvedMessage | undefined => {
  assertMessageId(id);
  const requestedLocale = canonicalizeLocale(locale);
  const catalogByLocale = new Map<string, Readonly<Record<string, unknown>>>();

  for (const catalog of catalogs) {
    const rawCatalog: unknown = catalog;
    if (
      !isRecord(rawCatalog) ||
      typeof rawCatalog['locale'] !== 'string' ||
      !isRecord(rawCatalog['messages'])
    ) {
      throw new TypeError('Each message catalog must be an object');
    }
    const catalogLocale = canonicalizeLocale(rawCatalog['locale']);
    if (catalogByLocale.has(catalogLocale)) {
      throw new TypeError(`Duplicate message catalog locale: ${catalogLocale}`);
    }
    catalogByLocale.set(catalogLocale, rawCatalog['messages']);
  }

  for (const candidate of getLocaleFallbackChain(requestedLocale, options.fallbackLocale)) {
    const messages = catalogByLocale.get(candidate);
    if (messages !== undefined && Object.hasOwn(messages, id)) {
      const message = messages[id];
      if (typeof message !== 'string') throw new TypeError(`Message ${id} must be a string`);
      return Object.freeze({
        id,
        locale: candidate,
        message: formatMessage(message, options.values, options),
        source: 'catalog',
        usedFallback: candidate !== requestedLocale,
      });
    }
  }

  if (options.defaultMessage === undefined) return undefined;
  return Object.freeze({
    id,
    locale: requestedLocale,
    message: formatMessage(options.defaultMessage, options.values, options),
    source: 'default',
    usedFallback: true,
  });
};
