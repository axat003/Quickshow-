import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import authRoutes from './routes/auth.js';


const app = express();
const port = 3000;

// Initialize DB connection flag
let dbConnected = false;

// Middleware - CORS must be first
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middleware to ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error.message);
      return res.status(503).json({ error: 'Database connection failed' });
    }
  }
  next();
});

// Auth routes (local) - before Clerk middleware
app.use('/api/auth', authRoutes);

// Clerk middleware - after auth routes so it doesn't block them
app.use(clerkMiddleware());

// Health check endpoint
app.get('/', (req, res) => res.send('Server Is Live!'));
app.use('/api/inngest', serve({ client: inngest, functions }));

// For Vercel deployment
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
}