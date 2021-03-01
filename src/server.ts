// src/server.ts
import 'reflect-metadata';

import routes from './routes';
import express from 'express';

import './database';

const app = express();

app.use(express.json());

app.use(routes);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333');
});
