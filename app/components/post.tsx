import { Link } from '@remix-run/react';
import type { post } from '~/drizzle/schema';

type Post = typeof post.$inferSelect;

export function Post({ post, small }: { post: Post; small?: boolean }) {
  return (
    <article key={post.id} style={small ? { zoom: 0.8 } : undefined}>
      {post.text}
      <footer style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to={`/${post.user}`}>{`@${post.user}`}</Link>
        <Link to={`/post/${post.id}`}>
          {post.thread_id ? '(View Thread) ' : null}
          {post.created_at}
        </Link>
      </footer>
    </article>
  );
}
