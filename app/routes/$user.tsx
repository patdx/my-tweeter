import { unstable_defineLoader } from '@remix-run/cloudflare';
import { Link, useLoaderData, useParams } from '@remix-run/react';
import { desc, eq } from 'drizzle-orm';
import { createDrizzle } from '~/drizzle/db';
import { post } from '~/drizzle/schema';
import * as v from 'valibot';
import { Post } from '~/components/post';

export const loader = unstable_defineLoader(async ({ context, params }) => {
  const { user } = v.parse(v.object({ user: v.string() }), params);

  const posts = await createDrizzle(context.cloudflare.env.DB)
    .select()
    .from(post)
    .orderBy(desc(post.created_at))
    .where(eq(post.user, user))
    .limit(100)
    .all();

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
