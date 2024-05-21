import { unstable_defineLoader } from '@remix-run/cloudflare';
import { useLoaderData, useParams } from '@remix-run/react';
import { Fragment } from 'react/jsx-runtime';
import * as v from 'valibot';
import { Post } from '~/components/post';
import { createDrizzle } from '~/drizzle/db';
import { getPosts } from '~/utils.server';
import { PostForm, action } from './api.post';

export const loader = unstable_defineLoader(async ({ context, params }) => {
  const { id: postId } = v.parse(v.object({ id: v.string() }), params);

  const drizzle = createDrizzle(context.cloudflare.env.DB);

  const posts = await getPosts(drizzle, { postId });

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
            <Post post={post} small={post.id !== id} showThreadSize={false} />
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
