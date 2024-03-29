// src/server.ts
import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import rateLimiter from './middlewares/RateLimiter';
import routes from './routes';
import uploadConfig from '@config/upload';
import cors from 'cors';
import { errors } from 'celebrate';
import '../typeorm';
import '@shared/container';

import AppError from '../../errors/AppError';

const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: (err.message)
    });
  }
  console.error(err);
  return response.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333');
});
