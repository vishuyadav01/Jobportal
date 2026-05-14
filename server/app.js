import express from 'express';
import cors from 'cors';
import { errorMiddleware, notFound } from './middleware/errorMiddleware.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://jobportal-pearl-eight.vercel.app',
  credentials: true
}));

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to HireSphere API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Error Handling
app.use(notFound);
app.use(errorMiddleware);

export default app;
