import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import '@picocss/pico/css/pico.classless.css';

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
        <main style={{ maxWidth: '512px' }}>
          <section>{children}</section>
          <section style={{ textAlign: 'center' }}>
            <a href='https://github.com/patdx'>@patdx</a>
            {' | '}
            <a href='https://github.com/patdx/my-tweeter'>Github</a>
          </section>
          <div className='grid'></div>
        </main>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
