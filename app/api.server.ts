import { vValidator } from '@hono/valibot-validator';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import * as v from 'valibot';
import { post } from './drizzle/schema';
import { getObscenity } from './utils.server';
import type { AppLoadContext } from '@remix-run/cloudflare';
import { createDrizzle } from './drizzle/db';

export type Bindings = {
  DB: D1Database;
  cf: CfProperties;
};

export const app = new Hono<{ Bindings: Bindings }>()
  .basePath('/api')
  .post(
    '/tweeters',
    vValidator('json', v.object({ text: v.string() })),
    async (c) => {
      const { text } = c.req.valid('json');

      if (getObscenity().hasMatch(text)) {
        console.log('Obscenity found');
        // TODO: nicer error handling
        throw new Error('Not allowed');
      }

      const id = crypto.randomUUID();

      const drizzle = createDrizzle(c.env.DB);

      await drizzle.insert(post).values({ id, text, user: 'remix' });

      return c.json({ id });
    }
  );

export type AppType = typeof app;
