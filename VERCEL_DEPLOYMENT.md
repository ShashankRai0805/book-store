# Book Store - Vercel Deployment Guide

This project is now configured for deployment on Vercel with both frontend and backend components.

## 🚀 Deployment Instructions

### Prerequisites
1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. A MongoDB database (MongoDB Atlas recommended for production)

### Step 1: Environment Variables
Before deploying, you need to set up environment variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_jwt_tokens
PORT=1000
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Connect your Git repository to Vercel
2. Import your project
3. Vercel will automatically detect the configuration from `vercel.json`
4. Deploy!

### Step 3: Configure Your Database
Make sure your MongoDB database allows connections from Vercel's IP addresses (or allow all IPs for MongoDB Atlas).

## 📁 Project Structure

```
├── vercel.json          # Vercel configuration
├── .vercelignore       # Files to ignore during deployment
├── .env.example        # Environment variables template
├── frontend/           # React app (built as static site)
│   ├── src/
│   └── package.json
└── backend/            # Express API (deployed as serverless functions)
    ├── app.js
    ├── routes/
    └── package.json
```

## 🔧 Configuration Files Created

### 1. `vercel.json`
- Configures how Vercel builds and serves your application
- Routes API calls to the backend serverless functions
- Serves the frontend as static files

### 2. `.vercelignore`
- Excludes unnecessary files from deployment
- Reduces deployment size and time

### 3. Updated `backend/app.js`
- Added conditional export for Vercel serverless functions
- Added health check endpoint
- Maintains local development compatibility

### 4. Updated `frontend/src/api/index.js`
- Dynamic API base URL for development and production
- Uses `/api/v1` for production (routed by Vercel)
- Uses `http://localhost:1000/api/v1` for local development

## 🌐 API Endpoints

After deployment, your API will be available at:
- Production: `https://your-app.vercel.app/api/v1/`
- Local: `http://localhost:1000/api/v1/`

## 🔍 Troubleshooting

### Common Issues:

1. **API calls not working**: Check that environment variables are set correctly in Vercel
2. **Database connection fails**: Ensure MongoDB allows connections from Vercel IPs
3. **Build fails**: Check that all dependencies are listed in package.json
4. **CORS issues**: The backend is configured with CORS, but check if additional domains need to be allowed

### Health Check
Visit `https://your-app.vercel.app/api/health` to check if your backend is running.

## 🛠 Local Development

For local development, you can still run:

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
```

The API base URL will automatically switch to localhost for development.

## 📝 Notes

- The backend runs as Vercel serverless functions, which means it starts fresh on each request
- Database connections should use connection pooling for better performance
- Static files (images, etc.) should be placed in the frontend's public directory
- Environment variables are different between local development (.env files) and production (Vercel dashboard)
