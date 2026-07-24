import express from 'express';
import cors from 'cors';
import path from 'path';
import opportunityRoutes from './routes/opportunityRoutes.js';
import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import { requestLogger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Universal CORS middleware for REST API deployment
app.use(cors());
app.options('*', cors());

app.use(requestLogger);
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Placement Eligibility Predictor API',
    version: '1.0.0',
    endpoints: {
      opportunities: '/api/opportunities',
      search: '/api/opportunities/search?name=tech',
      companies: '/api/companies',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/companies', companyRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
