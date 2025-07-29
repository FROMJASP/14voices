module.exports = {
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl', 'en'],
    localePath: './public/locales',
    localeDetection: false, // We want Dutch as default, not auto-detection
  },
  fallbackLng: 'nl',
  ns: ['common', 'admin', 'landing', 'voiceovers'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
};
