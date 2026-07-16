import express from 'express';
import opportunityRoutes from './routes/opportunityRoutes.js';
import { requestLogger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(requestLogger);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Placement Eligibility Predictor API',
    version: '1.0.0',
    endpoints: {
      opportunities: '/api/opportunities',
      search: '/api/opportunities/search?name=tech'
    }
  });
});

app.use('/api/opportunities', opportunityRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
