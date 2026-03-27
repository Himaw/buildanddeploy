import 'dotenv/config';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// When NEON_LOCAL_HOST is set the app is running against the Neon Local proxy
// inside Docker Compose. The proxy only supports HTTP (not WebSocket), so we
// switch the serverless driver to HTTP-only mode and point it at the proxy.
if (process.env.NEON_LOCAL_HOST) {
  const host = process.env.NEON_LOCAL_HOST;
  neonConfig.fetchEndpoint = `http://${host}:5432/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

export default { db, sql };
