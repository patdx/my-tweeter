import { unstable_defineAction } from '@remix-run/cloudflare';
import { Form, useSubmit } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import type { Ref } from 'react';
import * as v from 'valibot';
import { createDrizzle } from '~/drizzle/db';
import { post } from '~/drizzle/schema';
import { getObscenity } from '~/utils.server';

const ActionSchema = v.object({
  reply: v.nullish(v.string()),
  user: v.string([
    v.toTrimmed(),
    v.toLowerCase(),
    v.minLength(1),
    v.regex(/^[a-z0-9_]+$/),
  ]),
  text: v.string([v.toTrimmed(), v.minLength(1)]),
});

export const action = unstable_defineAction(async ({ request, context }) => {
  const formData = await request.formData();

  const { reply, user, text } = v.parse(ActionSchema, {
    reply: formData.get('reply'),
    user: formData.get('user'),
    text: formData.get('text'),
  });

  console.log({ reply, user, text });

  if (getObscenity().hasMatch(text)) {
    console.log('Obscenity found');
    // TODO: nicer error handling
    throw new Error('Not allowed');
  }

  const drizzle = createDrizzle(context.cloudflare.env.DB);

  let threadId: string | null = null;

  if (reply) {
    const replyPost = await drizzle
      .select()
      .from(post)
      .where(eq(post.id, reply))
      .get();

    if (!replyPost) {
      throw new Error('Reply post not found');
    }

    if (replyPost?.thread_id) {
      threadId = replyPost.thread_id;
    } else {
      threadId = crypto.randomUUID();
      await drizzle
        .update(post)
        .set({ thread_id: threadId })
        .where(eq(post.id, replyPost.id))
        .execute();
    }
  }

  const postId = crypto.randomUUID();

  await drizzle.insert(post).values({
    id: postId,
    text,
    user,
    thread_id: threadId,
    reply_to_id: reply,
  });

  return { id: postId };
});

export function PostForm(props: {
  /** id of post to reply to */
  reply?: string;
  ref?: Ref<HTMLFormElement>;
}) {
  const submit = useSubmit();

  // https://github.com/remix-run/remix/discussions/869#discussioncomment-1831610
  // action='/api/post'
  return (
    <Form method='post' ref={props.ref}>
      {props.reply && <input type='hidden' name='reply' value={props.reply} />}
      <label>
        Username
        <input type='text' name='user' defaultValue='remix' />
      </label>
      <label>
        Post
        <textarea
          style={{ fieldSizing: 'content', minHeight: '5em' } as any}
          name='text'
          placeholder='Write a tweeter...'
          aria-label='Text'
          autoComplete='none'
          required
          onKeyDown={(event) => {
            event.currentTarget.form;
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              if (!event.currentTarget.form) throw new Error('Form not found');
              submit(event.currentTarget.form);
            }
          }}
        />
      </label>
      <button type='submit'>Post</button>
    </Form>
  );
}
