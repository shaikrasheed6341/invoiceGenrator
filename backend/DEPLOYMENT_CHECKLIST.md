# 🚀 Production Deployment Checklist for Render

## ✅ Pre-Deployment Checks

### 1. Environment Variables
- [ ] `NODE_ENV=production` is set
- [ ] `DATABASE_URL` points to production PostgreSQL
- [ ] `JWT_SECRET` is a strong, unique secret
- [ ] `SESSION_SECRET` is a strong, unique secret
- [ ] `RENDER_EXTERNAL_URL` is set to your Render app URL
- [ ] `FRONTEND_URL` points to your Vercel frontend

### 2. Security
- [ ] All sensitive data is in environment variables
- [ ] No hardcoded secrets in code
- [ ] CORS is properly configured for production
- [ ] Rate limiting is enabled
- [ ] Helmet security headers are active
- [ ] Session cookies are secure in production

### 3. Database
- [ ] PostgreSQL database is created on Render
- [ ] Prisma migrations are ready
- [ ] Database connection string is correct
- [ ] Database user has proper permissions

### 4. Code Quality
- [ ] All console.log statements are removed or wrapped
- [ ] Error handling is comprehensive
- [ ] Input validation is in place
- [ ] API endpoints are properly documented

### 5. Performance
- [ ] Compression middleware is enabled
- [ ] Request logging is configured
- [ ] Ping service is configured for Render free tier
- [ ] Memory limits are set appropriately

## 🚀 Deployment Steps

### Step 1: Render Database Setup
1. Create PostgreSQL database on Render
2. Note the connection string
3. Test database connectivity

### Step 2: Render Web Service Setup
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Configure environment variables
5. Set auto-deploy to main branch

### Step 3: Environment Variables on Render
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-super-secret-session-key
RENDER_EXTERNAL_URL=https://your-app.onrender.com
FRONTEND_URL=https://invoice-genrator-ruddy.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Step 4: Database Migration
1. Deploy service first
2. Use Render shell to run migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

### Step 5: Testing
1. Test health endpoint: `/health`
2. Test ping endpoint: `/ping`
3. Test main API endpoints
4. Verify CORS works with frontend
5. Check logs for errors

## 🔍 Post-Deployment Monitoring

### Health Checks
- [ ] `/health` endpoint returns 200
- [ ] `/ping` endpoint responds correctly
- [ ] Database connection is stable
- [ ] Ping service is keeping server alive

### Performance Monitoring
- [ ] Response times are acceptable
- [ ] Memory usage is within limits
- [ ] No memory leaks detected
- [ ] Server stays awake on free tier

### Error Monitoring
- [ ] Check Render logs regularly
- [ ] Monitor for 500 errors
- [ ] Watch for database connection issues
- [ ] Verify ping service is working

## 🚨 Common Issues & Solutions

### Issue: Build Fails
- **Solution**: Check package.json scripts, ensure all dependencies are listed

### Issue: Database Connection Fails
- **Solution**: Verify DATABASE_URL format, check database permissions

### Issue: CORS Errors
- **Solution**: Ensure FRONTEND_URL is correct, check CORS configuration

### Issue: Server Goes to Sleep
- **Solution**: Verify ping service is running, check RENDER_EXTERNAL_URL

### Issue: Memory Issues
- **Solution**: Check memory limits in ecosystem.config.js, optimize queries

## 📊 Success Metrics

- [ ] Service deploys successfully
- [ ] Health checks pass consistently
- [ ] Frontend can connect to backend
- [ ] All API endpoints work
- [ ] Server stays awake on free tier
- [ ] Response times < 2 seconds
- [ ] No critical errors in logs

## 🔗 Useful Links

- [Render Dashboard](https://dashboard.render.com/)
- [Render Documentation](https://render.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

**Ready for deployment! 🚀**

After deployment, your backend will be available at:
`https://your-app-name.onrender.com`
