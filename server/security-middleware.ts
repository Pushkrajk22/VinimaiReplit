import type { Express, Request, Response, NextFunction } from "express";

// Simple rate limiting without external dependency
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const createRateLimit = (windowMs: number, maxRequests: number, message: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    // Clean up expired entries
    rateLimitStore.forEach((value, key) => {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    });
    
    const entry = rateLimitStore.get(clientId);
    
    if (!entry || now > entry.resetTime) {
      rateLimitStore.set(clientId, { count: 1, resetTime: now + windowMs });
      next();
    } else if (entry.count < maxRequests) {
      entry.count++;
      next();
    } else {
      res.status(429).json({ error: message });
    }
  };
};

export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // max 5 requests
  "Too many authentication attempts, please try again later"
);

export const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // max 100 requests
  "Too many requests, please try again later"
);

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.razorpay.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: blob:; " +
    "connect-src 'self' *.razorpay.com; " +
    "frame-src *.razorpay.com;"
  );
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // In production, add HTTPS enforcement
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
};

// Password validation helper
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    // In production, you would send this to a proper logging service
    if (res.statusCode >= 400) {
      console.warn('[SECURITY]', JSON.stringify(logData));
    } else {
      console.log('[REQUEST]', JSON.stringify(logData));
    }
  });
  
  next();
};