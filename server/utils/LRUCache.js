
/**
 * Least Recently Used (LRU) Cache Implementation
 * No external libraries used
 */
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  // Get value from cache, move to most recently used
  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }
    
    // Move to most recently used by deleting and re-adding
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }

  // Add/Update value in cache
  put(key, value) {
    // If key exists, remove it and re-add to make it most recent
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } 
    // If at capacity, remove least recently used (first item in Map)
    else if (this.cache.size >= this.capacity) {
      const lruKey = this.cache.keys().next().value;
      this.cache.delete(lruKey);
    }
    
    // Add new entry
    this.cache.set(key, value);
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

module.exports = LRUCache;
