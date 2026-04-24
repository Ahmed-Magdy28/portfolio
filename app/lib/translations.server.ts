import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Locale, TranslationKeys } from '../i18n/translations';

const localesDir = path.join(process.cwd(), 'app', 'i18n', 'locales');

const localeFile = (locale: Locale) => path.join(localesDir, `${locale}.json`);

export async function readLocale(locale: Locale): Promise<TranslationKeys> {
  const raw = await readFile(localeFile(locale), 'utf-8');
  return JSON.parse(raw) as TranslationKeys;
}

export async function readAllLocales(): Promise<Record<Locale, TranslationKeys>> {
  const [en, ar] = await Promise.all([readLocale('en'), readLocale('ar')]);
  return { en, ar };
}

export async function writeLocale(locale: Locale, value: TranslationKeys) {
  await writeFile(localeFile(locale), `${JSON.stringify(value, null, 2)}\n`, 'utf-8');
}
