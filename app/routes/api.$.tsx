import {
  unstable_defineAction,
  unstable_defineLoader,
} from '@remix-run/cloudflare';
import { app } from '~/api.server';

export const loader = unstable_defineLoader(({ request, context }) => {
  return app.fetch(
    request,
    {
      ...context.cloudflare.env,
      cf: context.cloudflare.cf,
    },
    context.cloudflare.ctx
  );
});

export const action = unstable_defineAction(({ request, context }) => {
  return app.fetch(
    request,
    {
      ...context.cloudflare.env,
      cf: context.cloudflare.cf,
    },
    context.cloudflare.ctx
  );
});
