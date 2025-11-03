# Daggerbrain
todos:
[ ] add followup selections for subclass upgrade an multiclass options
[ ] make sure class mastery levels are derived correctly
[ ] make sure secondary class is derived correctly

## When on zscaler:
NODE_TLS_REJECT_UNAUTHORIZED=0 bun i

## how to enable Sentry:
uncomment the following:
*  /routes/hooks.client.ts
*  /routes/hooks.server.ts
*  /routes/instrumentation.server.ts
*  svelte.config.js --> experimental section