import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import ininializeRoutes from './routes/index.js';
import passport from 'passport';
import { initPassport } from './middlewares/passport-config.js';
import morganMiddleware from './middlewares/morgan.middleware.js';

const init = async (app) => {
  const MONGO_URI = process.env.MONGO_CONNECTION_STRING;

  initPassport(passport);
  
  // Add the morgan middleware
  app.use(morganMiddleware);
  app.use(cors({ origin: process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()) }));
  app.use(
    express.json({
      limit: '5mb',
      verify: (req, res, buf) => {
        req.rawBody = buf.toString();
      },
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());

  await mongoose.connect(MONGO_URI);

  console.log('Connected to MongoDB');

  ininializeRoutes(app);
};

export default init;
