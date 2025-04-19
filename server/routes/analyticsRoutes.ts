
import { Request, Response } from 'express';
import { addDelay } from '../utils/delayUtils';
import { lruCache, lfuCache } from '../utils/cacheInstances';
const readmissionData = require('../../src/data/readmissionData');

export const getAnalytics = async (req: Request, res: Response) => {
  const cacheKey = 'analytics';
  let data;
  let fromCache = false;
  
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
    
    lruCache.put(cacheKey, data);
    lfuCache.put(cacheKey, data);
    
    console.log('Fresh analytics data generated and cached');
  }
  
  await addDelay(fromCache);
  
  res.json({
    data,
    source: fromCache ? 'cache' : 'fresh',
    responseTime: fromCache ? 'fast' : 'normal'
  });
};
