import { createRequire } from 'node:module';
import type { Express } from 'express';

const require = createRequire(import.meta.url);
const { app } = require('../dist/server.cjs') as { app: Express };

export default app;
