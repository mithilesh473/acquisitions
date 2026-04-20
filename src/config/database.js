import 'dotenv/config';

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const databaseUrl = process.env.DATABASE_URL;

if (process.env.NODE_ENV !== 'production' && databaseUrl) {
  try {
    const parsedUrl = new URL(databaseUrl);
    const isLocalHost = ['localhost', '127.0.0.1', 'neon-local'].includes(parsedUrl.hostname);

    if (isLocalHost) {
      neonConfig.fetchEndpoint = `http://${parsedUrl.host}/sql`;
      neonConfig.useSecureWebSocket = false;
      neonConfig.poolQueryViaFetch = true;
    }
  } catch (error) {
    // Ignore invalid DATABASE_URL values at startup.
  }
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

export { db, sql };
