
import { Request, Response, NextFunction } from 'express';
import { hashIP } from './hashUtils';

class RateLimiter {
  private windowMs: number;
  private  maxRequests: number;
  private requests: Map<string, number>;
  private resetTimers: Map<string, NodeJS.Timeout>;

  constructor(options: { windowMs?: number; maxRequests?: number }) {
    this.windowMs = options.windowMs || 60000;
    this.maxRequests = options.maxRequests || 60;
    this.requests = new Map();
    this.resetTimers = new Map();
  }

  getMaxRequests() {
    return this.maxRequests;
  }

  getWindowMs() {
    return this.maxRequests;
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip || req.socket.remoteAddress || '0.0.0.0';
      const hashedIP = hashIP(ip);

      if (!this.requests.has(hashedIP)) {
        this.requests.set(hashedIP, 0);
        
        const timer = setTimeout(() => {
          this.requests.delete(hashedIP);
          this.resetTimers.delete(hashedIP);
        }, this.windowMs);
        
        this.resetTimers.set(hashedIP, timer);
      }

      const currentCount = this.requests.get(hashedIP) || 0;
      this.requests.set(hashedIP, currentCount + 1);

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

export default RateLimiter;
