import {
  unstable_defineLoader,
  type MetaFunction,
} from '@remix-run/cloudflare';
import { useActionData, useLoaderData, useSubmit } from '@remix-run/react';
import { desc } from 'drizzle-orm';
import { useEffect, useRef } from 'react';
import { Post } from '~/components/post';
import { createDrizzle } from '~/drizzle/db';
import { post } from '~/drizzle/schema';
import { PostForm, action } from './api.post';

export const meta: MetaFunction = () => {
  return [
    { title: 'My Tweeter' },
    {
      name: 'description',
      content: 'Write your own tweeters with Remix and Cloudflare Pages',
    },
  ];
};

export const loader = unstable_defineLoader(async ({ context }) => {
  const posts = await createDrizzle(context.cloudflare.env.DB)
    .select()
    .from(post)
    .orderBy(desc(post.created_at))
    .limit(100)
    .all();

  return { posts };
});

export { action };

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof import('./api.post').action>();
  const form = useRef<HTMLFormElement>(null);
  const posts = data.posts;

  const submit = useSubmit();

  useEffect(() => {
    if (actionData?.id) {
      form.current?.reset();
    }
  }, [actionData?.id]);

  return (
    <>
      <PostForm ref={form} />
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
