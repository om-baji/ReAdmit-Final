
const express = require('express');
const cors = require('cors');
const path = require('path');
const RateLimiter = require('./utils/RateLimiter');
const LRUCache = require('./utils/LRUCache');
const LFUCache = require('./utils/LFUCache');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Add CORS middleware
app.use(cors());
app.use(express.json());

// Set up Rate Limiter (100 requests per minute)
const rateLimiter = new RateLimiter({
  windowMs: 60000,  // 1 minute
  maxRequests: 100
});

// Apply rate limiting middleware
app.use(rateLimiter.middleware());

// Initialize caches
const lruCache = new LRUCache(100); // Store up to 100 items
const lfuCache = new LFUCache(100); // Store up to 100 items

// Utility to add artificial delay (simulate network/processing delays)
const addDelay = async (isFromCache) => {
  const minDelay = isFromCache ? 50 : 200;
  const maxDelay = isFromCache ? 150 : 600;
  const delay = Math.floor(Math.random() * (maxDelay - minDelay) + minDelay);
  
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Import data from readmissionData.ts
const readmissionData = require('../src/data/readmissionData');

// API Routes
app.get('/api/stats', async (req, res) => {
  const cacheKey = 'stats';
  let data;
  let fromCache = false;
  
  // Check LRU cache first
  if (lruCache.has(cacheKey)) {
    data = lruCache.get(cacheKey);
    fromCache = true;
    console.log('Stats served from LRU cache');
  } 
  // Then check LFU cache
  else if (lfuCache.has(cacheKey)) {
    data = lfuCache.get(cacheKey);
    fromCache = true;
    console.log('Stats served from LFU cache');
  } 
  // If not in either cache, generate fresh data
  else {
    data = readmissionData.calculateStats();
    
    // Store in both caches
    lruCache.put(cacheKey, data);
    lfuCache.put(cacheKey, data);
    
    console.log('Fresh stats generated and cached');
  }
  
  // Add artificial delay based on whether it's cached or not
  await addDelay(fromCache);
  
  res.json({
    data,
    source: fromCache ? 'cache' : 'fresh',
    responseTime: fromCache ? 'fast' : 'normal'
  });
});

// API for patients data
app.get('/api/patients', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const cacheKey = `patients_${page}_${limit}`;
  
  let data;
  let fromCache = false;
  
  // Cache logic
  if (lruCache.has(cacheKey)) {
    data = lruCache.get(cacheKey);
    fromCache = true;
    console.log(`Patients (page ${page}) served from LRU cache`);
  } else if (lfuCache.has(cacheKey)) {
    data = lfuCache.get(cacheKey);
    fromCache = true;
    console.log(`Patients (page ${page}) served from LFU cache`);
  } else {
    // Calculate pagination
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;
    data = readmissionData.patients.slice(startIdx, endIdx);
    
    // Cache the result
    lruCache.put(cacheKey, data);
    lfuCache.put(cacheKey, data);
    
    console.log(`Fresh patients data (page ${page}) generated and cached`);
  }
  
  // Add artificial delay
  await addDelay(fromCache);
  
  res.json({
    data,
    page,
    limit,
    total: readmissionData.patients.length,
    totalPages: Math.ceil(readmissionData.patients.length / limit),
    source: fromCache ? 'cache' : 'fresh',
    responseTime: fromCache ? 'fast' : 'normal'
  });
});

// API for patient details
app.get('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `patient_${id}`;
  
  let data;
  let fromCache = false;
  
  // Cache logic
  if (lruCache.has(cacheKey)) {
    data = lruCache.get(cacheKey);
    fromCache = true;
    console.log(`Patient ${id} served from LRU cache`);
  } else if (lfuCache.has(cacheKey)) {
    data = lfuCache.get(cacheKey);
    fromCache = true;
    console.log(`Patient ${id} served from LFU cache`);
  } else {
    // Find patient
    data = readmissionData.patients.find(p => p.id === id);
    
    if (!data) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Cache the result
    lruCache.put(cacheKey, data);
    lfuCache.put(cacheKey, data);
    
    console.log(`Fresh patient ${id} data generated and cached`);
  }
  
  // Add artificial delay
  await addDelay(fromCache);
  
  res.json({
    data,
    source: fromCache ? 'cache' : 'fresh',
    responseTime: fromCache ? 'fast' : 'normal'
  });
});

// API for analytics data
app.get('/api/analytics', async (req, res) => {
  const cacheKey = 'analytics';
  let data;
  let fromCache = false;
  
  // Cache logic
  if (lruCache.has(cacheKey)) {
    data = lruCache.get(cacheKey);
    fromCache = true;
    console.log('Analytics served from LRU cache');
  } else if (lfuCache.has(cacheKey)) {
    data = lfuCache.get(cacheKey);
    fromCache = true;
    console.log('Analytics served from LFU cache');
  } else {
    data = {
      riskFactors: readmissionData.analyzeRiskFactors(),
      demographics: readmissionData.analyzeDemographics(),
      trends: readmissionData.monthlyTrends,
    };
    
    // Cache the result
    lruCache.put(cacheKey, data);
    lfuCache.put(cacheKey, data);
    
    console.log('Fresh analytics data generated and cached');
  }
  
  // Add artificial delay
  await addDelay(fromCache);
  
  res.json({
    data,
    source: fromCache ? 'cache' : 'fresh',
    responseTime: fromCache ? 'fast' : 'normal'
  });
});

// Default catch-all handler
app.get('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Rate limit: ${rateLimiter.maxRequests} requests per ${rateLimiter.windowMs / 1000}s`);
  console.log(`LRU Cache capacity: ${lruCache.capacity}`);
  console.log(`LFU Cache capacity: ${lfuCache.capacity}`);
});
