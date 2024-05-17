import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tweets = sqliteTable('tweets', {
  id: text('id').primaryKey(),
  text: text('text'),
  user_name: text('user_name'),
  created_at: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
