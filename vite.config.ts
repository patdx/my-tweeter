import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import envOnly from 'vite-env-only';

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      future: {
        unstable_singleFetch: true,
      },
    }),
    tsconfigPaths(),
    envOnly(),
  ],
});
