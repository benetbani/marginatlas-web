/* THE HARNESS ENVIRONMENT PRELOAD. Loads the site's .env.local so the adapters
   that touch the database can construct their client, which the country page's
   money card needs (its rows come from live cells). Pass as
   --require ./scripts/harness/env.cjs before the tsx entry. Because of this the
   page-level checks run before a ship (npm run harness:page), never in the
   prebuild chain, which must not need the network or a secret. */
try { process.loadEnvFile('.env.local'); } catch (e) { /* no env file: adapters that need one will say so */ }
