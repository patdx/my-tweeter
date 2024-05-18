import { Link } from '@remix-run/react';
import type { post } from '~/drizzle/schema';

type Post = typeof post.$inferSelect & {
  /** may be available on home page at the moment */
  reply_to_user?: string | null;
};

export function Post({ post, small }: { post: Post; small?: boolean }) {
  return (
    <article key={post.id} style={small ? { zoom: 0.8 } : undefined}>
      {post.reply_to_user && (
        <header>
          Replying to <UserLink user={post.reply_to_user} />
        </header>
      )}
      {post.text}
      <footer className='text-sm md:text-base flex justify-between'>
        <UserLink user={post.user} />
        <Link to={`/post/${post.id}`}>
          {post.thread_id ? '(View Thread) ' : null}
          {post.created_at}
        </Link>
      </footer>
    </article>
  );
}

export function UserLink({ user }: { user: string }) {
  return <Link to={`/${user}`}>{`@${user}`}</Link>;
}
