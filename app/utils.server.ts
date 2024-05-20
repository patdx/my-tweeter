import { desc, asc, eq, getTableColumns, sql, or } from 'drizzle-orm';
import { memoize } from 'lodash-es';
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity';
import { post } from '~/drizzle/schema';
import type { Drizzle } from './drizzle/db';
import { alias } from 'drizzle-orm/sqlite-core';
import type { Env } from '../load-context';

export const getObscenity = memoize(() => {
  const now = performance.now();
  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });
  console.log(`Obscenity matcher loaded in ${performance.now() - now}ms`);
  return matcher;
});

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const otherPost = alias(post, 'otherPost');

export function getPosts(
  drizzle: Drizzle,
  { userId, postId }: { userId?: string; postId?: string } = {}
) {
  const posts = drizzle
    .select({
      ...getTableColumns(post),
      // need to manually cast to a different column than "user" to avoid the
      // overwritten casting bug with Cloudflare D1
      reply_to_user: sql<string | null>`${otherPost.user}`.as('reply_to_user'),
    })
    .from(post)
    .orderBy(postId ? asc(post.created_at) : desc(post.created_at))
    .leftJoin(otherPost, eq(post.reply_to_id, otherPost.id))
    .where(
      userId
        ? eq(post.user, userId)
        : postId
        ? or(
            eq(post.id, postId),
            eq(
              post.thread_id,
              drizzle
                .select({ thread_id: post.thread_id })
                .from(post)
                .where(eq(post.id, postId))
            )
          )
        : undefined
    )
    .limit(100)
    .all();

  return posts;
}
