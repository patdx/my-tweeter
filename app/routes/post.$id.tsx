import { unstable_defineLoader } from '@remix-run/cloudflare';
import { useLoaderData, useParams } from '@remix-run/react';
import { asc, desc, eq, or } from 'drizzle-orm';
import { createDrizzle } from '~/drizzle/db';
import { post } from '~/drizzle/schema';
import * as v from 'valibot';
import { Post } from '~/components/post';
import { PostForm, action } from './api.post';
import { Fragment } from 'react/jsx-runtime';

export const loader = unstable_defineLoader(async ({ context, params }) => {
  const { id } = v.parse(v.object({ id: v.string() }), params);

  const drizzle = createDrizzle(context.cloudflare.env.DB);

  const posts = await drizzle
    .select()
    .from(post)
    .orderBy(asc(post.created_at))
    .where(
      or(
        eq(post.id, id),
        eq(
          post.thread_id,
          drizzle
            .select({ thread_id: post.thread_id })
            .from(post)
            .where(eq(post.id, id))
        )
      )
    )
    .limit(100)
    .all();

  return { posts };
});

export { action };

export default function PostPage() {
  const data = useLoaderData<typeof loader>();
  const { id } = useParams<{ id: string }>();

  return (
    <>
      {data.posts.map((post) => {
        return (
          <Fragment key={post.id}>
            <Post post={post} small={post.id !== id} />
            {post.id === id && (
              <article>
                <h4>Reply to post</h4>
                <PostForm reply={id} />
              </article>
            )}
          </Fragment>
        );
      })}
    </>
  );
}
