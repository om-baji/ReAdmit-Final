
import express from 'express';
import cors from 'cors';
import RateLimiter from './utils/RateLimiter';
import { getStats } from './routes/statsRoutes';
import { getPatients, getPatientById } from './routes/patientRoutes';
import { getAnalytics } from './routes/analyticsRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const rateLimiter = new RateLimiter({
  windowMs: 60000,
  maxRequests: 100
});

app.use(rateLimiter.middleware());

app.get('/api/stats', getStats);
app.get('/api/patients', getPatients);
app.get('/api/patients/:id', getPatientById);
app.get('/api/analytics', getAnalytics);

app.get('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Rate limit: ${rateLimiter.maxRequests} requests per ${rateLimiter.windowMs / 1000}s`);
});
