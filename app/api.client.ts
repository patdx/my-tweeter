import type { AppType } from './api.server';
import { hc } from 'hono/client';

export const client = hc<AppType>('/');
