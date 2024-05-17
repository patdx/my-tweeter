import {
  unstable_defineAction,
  unstable_defineLoader,
  type MetaFunction,
} from '@remix-run/cloudflare';
import {
  Await,
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from '@remix-run/react';
import { desc } from 'drizzle-orm';
import { Suspense, useEffect, useRef } from 'react';
import { createDrizzle } from '~/drizzle/db';
import { tweets } from '~/drizzle/schema';
import * as v from 'valibot';
import { getObscenity } from '~/utils.server';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  const posts = createDrizzle(context.cloudflare.env.DB)
    .select()
    .from(tweets)
    .orderBy(desc(tweets.created_at))
    .limit(100)
    .all();

  return { posts };
});

const ActionSchema = v.object({
  text: v.string(),
});

export const action = unstable_defineAction(async ({ request, context }) => {
  const formData = await request.formData();

  const { text } = v.parse(ActionSchema, {
    text: formData.get('text'),
  });

  if (getObscenity().hasMatch(text)) {
    console.log('Obscenity found');
    // TODO: nicer error handling
    throw new Error('Not allowed');
  }

  const id = crypto.randomUUID();

  await createDrizzle(context.cloudflare.env.DB)
    .insert(tweets)
    .values({ id, text, user_name: 'remix' });

  return { id };
});

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const form = useRef<HTMLFormElement>(null);

  const submit = useSubmit();

  useEffect(() => {
    if (actionData?.id) {
      form.current?.reset();
    }
  }, [actionData?.id]);

  // const posts = use(data.posts);
  // const posts = data.posts;
  // const result = useActionData<typeof action>();
  // action='/?index'
  return (
    <>
      <h1>My Tweeter</h1>
      <Form method='post' ref={form}>
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

        <button type='submit'>Post</button>
      </Form>
      <Suspense fallback={<div aria-busy='true'></div>}>
        <Await resolve={data.posts}>
          {(posts) =>
            posts.map((post) => (
              <article key={post.id}>
                <header>{`@${post.user_name}`}</header>
                {post.text}
                <footer style={{ textAlign: 'right' }}>
                  {post.created_at}
                </footer>
              </article>
            ))
          }
        </Await>
      </Suspense>
    </>
  );
}
