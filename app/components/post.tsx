import { Link } from '@remix-run/react';
import type { post } from '~/drizzle/schema';

type Post = typeof post.$inferSelect & {
  /** may be available on home page at the moment */
  reply_to_user?: string | null;
  thread_size?: number | null;
};

export function Post({
  post,
  small,
  showThreadSize = true,
}: {
  post: Post;
  small?: boolean;
  showThreadSize?: boolean;
}) {
  const thread_size = post.thread_size ?? 0;

  return (
    <article key={post.id} style={small ? { zoom: 0.8 } : undefined}>
      <header>
        <UserLink user={post.user} />
      </header>
      {post.reply_to_user && (
        <header>
          Replying to <UserLink user={post.reply_to_user} />
        </header>
      )}
      {post.text}
      <footer className='text-sm md:text-base flex justify-between'>
        <Link to={`/post/${post.id}`}>{post.created_at}</Link>
        <Link to={`/post/${post.id}`}>
          <ChatIcon />
          {showThreadSize
            ? thread_size >= 1
              ? ` ${thread_size}`
              : null
            : null}
        </Link>
      </footer>
    </article>
  );
}

export function UserLink({ user }: { user: string }) {
  return <Link to={`/${user}`}>{`@${user}`}</Link>;
}

export const ChatIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='w-6 h-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z'
    />
  </svg>
);
