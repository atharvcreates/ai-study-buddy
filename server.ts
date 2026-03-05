import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './backend/config/db';

import authRoutes from './backend/routes/authRoutes';
import chatRoutes from './backend/routes/chatRoutes';
import noteRoutes from './backend/routes/noteRoutes';
import taskRoutes from './backend/routes/taskRoutes';
import pomodoroRoutes from './backend/routes/pomodoroRoutes';
import pdfRoutes from './backend/routes/pdfRoutes';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Connect to database
  await connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/notes', noteRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/pomodoro', pomodoroRoutes);
  app.use('/api/pdf', pdfRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
