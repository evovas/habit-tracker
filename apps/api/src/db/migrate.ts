import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { config } from '../config/env.ts';
import { createDb } from './client.ts';

const { db, pool } = createDb(config.DATABASE_URL);

try {
  await migrate(db, { migrationsFolder: './drizzle' });
  console.info('Migration applied');
} finally {
  await pool.end();
}
