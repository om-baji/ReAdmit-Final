
import { Request, Response } from 'express';
import { addDelay } from '../utils/delayUtils';
import { lruCache, lfuCache } from '../utils/cacheInstances';
const readmissionData = require('../../src/data/readmissionData');

export const getStats = async (req: Request, res: Response) => {
  const cacheKey = 'stats';
  let data;
  let fromCache = false;
  
  if (lruCache.has(cacheKey)) {
    data = lruCache.get(cacheKey);
    fromCache = true;
    console.log('Stats served from LRU cache');
  } else if (lfuCache.has(cacheKey)) {
    data = lfuCache.get(cacheKey);
    fromCache = true;
    console.log('Stats served from LFU cache');
  } else {
    data = readmissionData.calculateStats();
    lruCache.put(cacheKey, data);
    lfuCache.put(cacheKey, data);
    console.log('Fresh stats generated and cached');
  }
  
  await addDelay(fromCache);
  
  res.json({
    data,
    source: fromCache ? 'cache' : 'fresh',
    responseTime: fromCache ? 'fast' : 'normal'
  });
};
