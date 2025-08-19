# Render Deployment Guide for Backend

## Prerequisites
- Render account (free tier available)
- PostgreSQL database (Render provides this)
- Your backend code ready

## Step 1: Set up PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Configure your database:
   - **Name**: `invoice-generator-db` (or your preferred name)
   - **Database**: `invoice_generator`
   - **User**: Auto-generated
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 15 (recommended)
4. Click "Create Database"
5. Save the connection details (you'll need them for environment variables)

## Step 2: Deploy Backend Service

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:

### Basic Settings
- **Name**: `invoice-generator-backend`
- **Environment**: `Node`
- **Region**: Same as your database
- **Branch**: `main` (or your default branch)

### Build & Deploy Settings
- **Build Command**: `docker build -t backend .`
- **Start Command**: `docker run -p $PORT:5000 backend`
- **Dockerfile Path**: `backend/Dockerfile` (if deploying from root repo)

### Environment Variables
Add these environment variables:

```
DATABASE_URL=postgresql://username:password@host:port/database_name
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-super-secret-session-key-here
FRONTEND_URL=https://your-frontend-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
JWT_SECRET=your-jwt-secret-key-here
```

**Important**: Get the `DATABASE_URL` from your PostgreSQL service in Render.

## Step 3: Configure Auto-Deploy

1. Enable "Auto-Deploy" for automatic deployments on code changes
2. Set up branch protection rules in GitHub if needed

## Step 4: Database Migration

After your service is deployed, you need to run Prisma migrations:

1. Go to your web service in Render
2. Click on "Shell" tab
3. Run these commands:

```bash
# Install Prisma CLI
npm install -g prisma

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## Step 5: Test Your Deployment

1. Your service will be available at: `https://your-service-name.onrender.com`
2. Test the health endpoint: `https://your-service-name.onrender.com/`
3. Test your main API endpoints

## Step 6: Update Frontend Configuration

Update your frontend's API base URL to point to your Render backend:
```javascript
const API_BASE_URL = 'https://your-service-name.onrender.com';
```

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Dockerfile syntax
   - Ensure all dependencies are in package.json
   - Verify Prisma schema is correct

2. **Database Connection Issues**:
   - Verify DATABASE_URL format
   - Check if database is accessible from your service
   - Ensure migrations have been run

3. **Port Issues**:
   - Render automatically sets PORT environment variable
   - Your app should use `process.env.PORT` (which you already do)

4. **Memory Issues**:
   - Free tier has 512MB RAM limit
   - Consider upgrading if you hit memory limits

### Performance Tips:

1. **Enable Caching**: Use Redis for session storage
2. **Database Optimization**: Add proper indexes
3. **Image Optimization**: Compress images before upload
4. **CDN**: Use Cloudflare or similar for static assets

## Monitoring

1. **Logs**: View real-time logs in Render dashboard
2. **Metrics**: Monitor CPU, memory, and response times
3. **Health Checks**: Your Dockerfile includes health checks
4. **Alerts**: Set up notifications for service failures

## Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **HTTPS**: Render provides automatic HTTPS
3. **CORS**: Configure CORS properly for production
4. **Rate Limiting**: Consider adding rate limiting middleware
5. **Input Validation**: Ensure all inputs are properly validated

## Cost Optimization

- **Free Tier**: 750 hours/month (suitable for development)
- **Paid Plans**: Start at $7/month for production use
- **Database**: Free tier includes 1GB storage

## Next Steps

1. Set up custom domain (optional)
2. Configure monitoring and alerting
3. Set up CI/CD pipeline
4. Implement backup strategies
5. Add performance monitoring

Your backend should now be running perfectly on Render! 🚀
