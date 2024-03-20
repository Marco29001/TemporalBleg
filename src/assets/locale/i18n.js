import {I18n} from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import {LOCALE} from './Locale';

export const i18n = new I18n(
  (translations = LOCALE),
  (options = {
    defaultLocale: 'en',
    enableFallback: true,
    locale: RNLocalize.getLocales()[0].languageCode,
  }),
);
