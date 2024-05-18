import * as schema from './schema';
import { drizzle } from 'drizzle-orm/d1';

export function createDrizzle(db: D1Database) {
  return drizzle(db, {
    schema,
    logger: true,
  });
}
