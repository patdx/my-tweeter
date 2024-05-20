import { unstable_defineLoader } from '@remix-run/cloudflare';
import { Link, useLoaderData, useParams } from '@remix-run/react';
import * as v from 'valibot';
import { Post } from '~/components/post';
import { createDrizzle } from '~/drizzle/db';
import { getPosts } from '~/utils.server';

export const loader = unstable_defineLoader(async ({ context, params }) => {
  const { user } = v.parse(v.object({ user: v.string() }), params);

  const drizzle = createDrizzle(context.cloudflare.env.DB);

  const posts = await getPosts(drizzle, { userId: user });

  return { posts };
});

export default function User() {
  const data = useLoaderData<typeof loader>();
  const { user } = useParams<{ user: string }>();

  return (
    <>
      <h2>
        <Link to={`/${user}`}>{`@${user}`}</Link>
      </h2>
      {data.posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
