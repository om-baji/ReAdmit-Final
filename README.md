
# ReadmitInsight Hub

A hospital readmission analytics dashboard built with React, TypeScript, and Express.

## Project Structure

- `/src` - React frontend code
- `/server` - Express backend with custom implementations

## Backend Features

This project includes a custom Express server with:

1. **Custom Rate Limiting** - IP-based rate limiting using SHA-256 hashing for privacy
2. **Custom Caching** - Two caching mechanisms:
   - LRU (Least Recently Used) Cache - Prioritizes recently accessed items
   - LFU (Least Frequently Used) Cache - Prioritizes frequently accessed items
3. **Simulated Network Conditions** - Variable response times for cached vs. fresh data
4. **Clean API Design** - RESTful endpoints with consistent patterns

## Getting Started

### Running the backend:
```bash
cd server
npm install
npm start
```

### Running the frontend:
```bash
npm install
npm run dev
```

## API Endpoints

- `GET /api/stats` - Get dashboard statistics
- `GET /api/patients` - Get paginated patient list
- `GET /api/patients/:id` - Get patient details
- `GET /api/analytics` - Get analytics data

## Deployment

For production deployment, you would need to:
1. Update the API base URL in `src/api/api.ts`
2. Configure appropriate environment variables
3. Set up proper server security measures

