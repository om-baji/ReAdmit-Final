
/**
 * Least Frequently Used (LFU) Cache Implementation
 * No external libraries used
 */
class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // key -> [value, count, timestamp]
    this.minCount = 0;
  }

  // Get value from cache
  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }
    
    // Update access count and timestamp
    const [value, count, _] = this.cache.get(key);
    this.cache.set(key, [value, count + 1, Date.now()]);
    
    return value;
  }

  // Add/Update value in cache
  put(key, value) {
    if (this.capacity <= 0) return;
    
    // Update existing entry
    if (this.cache.has(key)) {
      const [_, count, __] = this.cache.get(key);
      this.cache.set(key, [value, count + 1, Date.now()]);
      return;
    }
    
    // Handle eviction if at capacity
    if (this.cache.size >= this.capacity) {
      this.evictLFU();
    }
    
    // Add new entry with count 1
    this.cache.set(key, [value, 1, Date.now()]);
    this.minCount = 1; // New entries start at count 1
  }

  // Evict least frequently used item
  evictLFU() {
    let leastFreq = Number.MAX_SAFE_INTEGER;
    let leastRecent = Date.now();
    let leastFreqKey = null;
    
    // Find LFU (or oldest if tied)
    for (const [key, [_, count, timestamp]] of this.cache.entries()) {
      if (count < leastFreq || (count === leastFreq && timestamp < leastRecent)) {
        leastFreq = count;
        leastRecent = timestamp;
        leastFreqKey = key;
      }
    }
    
    if (leastFreqKey !== null) {
      this.cache.delete(leastFreqKey);
    }
  }

  // Check if key exists in cache
  has(key) {
    return this.cache.has(key);
  }

  // Get cache size
  size() {
    return this.cache.size;
  }
}

module.exports = LFUCache;
