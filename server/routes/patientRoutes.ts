
import { Request, Response } from 'express';
import { addDelay } from '../utils/delayUtils';
import { lruCache, lfuCache } from '../utils/cacheInstances';
const readmissionData = require('../../src/data/readmissionData');

export const getPatients = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const cacheKey = `patients_${page}_${limit}`;
  
  let data;
  let fromCache = false;
  
  if (lruCache.has(cacheKey)) {
    data = lruCache.get(cacheKey);
    fromCache = true;
    console.log(`Patients (page ${page}) served from LRU cache`);
  } else if (lfuCache.has(cacheKey)) {
    data = lfuCache.get(cacheKey);
    fromCache = true;
    console.log(`Patients (page ${page}) served from LFU cache`);
  } else {
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;
    data = readmissionData.patients.slice(startIdx, endIdx);
    
    lruCache.put(cacheKey, data);
    lfuCache.put(cacheKey, data);
    
    console.log(`Fresh patients data (page ${page}) generated and cached`);
  }
  
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
};

export const getPatientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cacheKey = `patient_${id}`;
  
  let data;
  let fromCache = false;
  
  if (lruCache.has(cacheKey)) {
    data = lruCache.get(cacheKey);
    fromCache = true;
    console.log(`Patient ${id} served from LRU cache`);
  } else if (lfuCache.has(cacheKey)) {
    data = lfuCache.get(cacheKey);
    fromCache = true;
    console.log(`Patient ${id} served from LFU cache`);
  } else {
    data = readmissionData.patients.find((p: any) => p.id === id);
    
    if (!data) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    lruCache.put(cacheKey, data);
    lfuCache.put(cacheKey, data);
    
    console.log(`Fresh patient ${id} data generated and cached`);
  }
  
  await addDelay(fromCache);
  
  res.json({
    data,
    source: fromCache ? 'cache' : 'fresh',
    responseTime: fromCache ? 'fast' : 'normal'
  });
};
