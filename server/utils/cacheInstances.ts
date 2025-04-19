
import LRUCache from './LRUCache';
import LFUCache from './LFUCache';

export const lruCache = new LRUCache<any>(100);
export const lfuCache = new LFUCache<any>(100);
