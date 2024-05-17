import { sql } from 'drizzle-orm';
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const post = sqliteTable(
  'post',
  {
    id: text('id').primaryKey(),
    thread_id: text('thread_id'),
    reply_to_id: text('reply_to_id'),
    text: text('text').notNull(),
    user: text('user').notNull(),
    created_at: text('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    thread_id: index('post_thread_id_idx').on(t.thread_id),
    user: index('post_user_idx').on(t.user),
    created_at: index('post_created_at_idx').on(t.created_at),
  })
);
