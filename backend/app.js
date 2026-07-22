import express from 'express';
import cors from 'cors';
import opportunityRoutes from './routes/opportunityRoutes.js';
import { requestLogger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(requestLogger);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Placement Eligibility Predictor API',
    version: '1.0.0',
    endpoints: {
      opportunities: '/api/opportunities',
      search: '/api/opportunities/search?name=tech',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

app.use('/api/opportunities', opportunityRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
