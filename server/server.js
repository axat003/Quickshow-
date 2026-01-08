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

await connectDB();

//Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Auth routes (local)
app.use('/api/auth', authRoutes);


//API Routes
app.get('/', (req, res) => res.send('Server Is Live!'))
app.use('/api/inngest', serve({ client: inngest, functions }));

// For Vercel deployment
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
}