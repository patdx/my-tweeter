# My Tweeter

This is just a mini experiment to put a simple Twitter clone on Cloudflare Pages.

https://my-tweeter.pages.dev/

## Development

Run the Vite dev server:

```sh
pnpm run dev
```

To run Wrangler:

```sh
pnpm run build
pnpm run start
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
pnpm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Deployment

> [!WARNING]  
> Cloudflare does _not_ use `wrangler.toml` to configure deployment bindings.
> You **MUST** [configure deployment bindings manually in the Cloudflare dashboard][bindings].

First, build your app for production:

```sh
pnpm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
pnpm run deploy
```

[bindings]: https://developers.cloudflare.com/pages/functions/bindings/
