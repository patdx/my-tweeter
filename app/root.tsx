import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import '@picocss/pico/css/pico.css';
import './root.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <main className='container' style={{ maxWidth: '512px' }}>
            <h1>
              <Link to='/'>My Tweeter</Link>
            </h1>
            <section>{children}</section>
            <section style={{ textAlign: 'center' }}>
              <a href='https://github.com/patdx'>@patdx</a>
              {' | '}
              <a href='https://github.com/patdx/my-tweeter'>Github</a>
            </section>
            <div className='grid'></div>
          </main>
        </QueryClientProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
