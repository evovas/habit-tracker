import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const createDb = (connectionString: string) => {
  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  const db = drizzle({
    client: pool,
    casing: 'snake_case',
  });

  return { db, pool };
};

export type Db = ReturnType<typeof createDb>['db'];
