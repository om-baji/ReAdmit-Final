
/**
 * Custom rate limiter implementation using IP hashing
 * No external libraries used
 */
const { hashIP } = require('./hashUtils');

class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000; // 1 minute default
    this.maxRequests = options.maxRequests || 60; // 60 requests per minute default
    this.requests = new Map(); // Store request counts by hashed IP
    this.resetTimers = new Map(); // Store reset timers by hashed IP
  }

  // Middleware function for Express
  middleware() {
    return (req, res, next) => {
      const ip = req.ip || req.connection.remoteAddress || '0.0.0.0';
      const hashedIP = hashIP(ip);

      // Initialize counts for this IP if not present
      if (!this.requests.has(hashedIP)) {
        this.requests.set(hashedIP, 0);
        
        // Set up timer to reset count after windowMs
        const timer = setTimeout(() => {
          this.requests.delete(hashedIP);
          this.resetTimers.delete(hashedIP);
        }, this.windowMs);
        
        this.resetTimers.set(hashedIP, timer);
      }

      // Get current count and increment
      const currentCount = this.requests.get(hashedIP);
      this.requests.set(hashedIP, currentCount + 1);

      // Check if rate limit is exceeded
      if (currentCount >= this.maxRequests) {
        return res.status(429).json({
          error: 'Too many requests, please try again later',
          retryAfter: this.windowMs / 1000,
        });
      }

      next();
    };
  }
}

module.exports = RateLimiter;
