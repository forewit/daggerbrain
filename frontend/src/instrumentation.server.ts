import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://1287f82f835d4746a2c94b571e4d20a7@o4510302003134464.ingest.us.sentry.io/4510302109696000',

  tracesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});