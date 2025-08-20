# Ping Service for Render Free Tier

This service helps keep your Render free tier server alive by pinging it every minute, preventing automatic shutdown after 5 minutes of inactivity.

## How It Works

Render free tier servers automatically shut down after 5 minutes of inactivity. This ping service sends a request every minute to keep the server active.

## Available Ping Methods

### 1. Built-in Ping Service (Recommended)

The ping service automatically starts when your server runs in production mode. It's integrated into your main server and pings every minute.

**Features:**
- ✅ Automatically starts in production
- ✅ Pings every 60 seconds
- ✅ Graceful shutdown handling
- ✅ Built into your main server

**Environment Variables:**
```bash
NODE_ENV=production
RENDER_EXTERNAL_URL=https://your-app.onrender.com
FRONTEND_URL=https://your-frontend.com
```

### 2. External Ping Script

Use this when you want to ping from an external source or as a backup method.

```bash
npm run ping
```

**Features:**
- ✅ Single ping execution
- ✅ External execution capability
- ✅ Good for testing connectivity

### 3. Cron Ping Service

A continuous ping service that can run independently.

```bash
npm run cron-ping
```

**Features:**
- ✅ Continuous pinging every minute
- ✅ Detailed logging and statistics
- ✅ Can run on external servers
- ✅ Graceful shutdown handling

## Setup Instructions

### 1. Environment Variables

Add these to your `.env` file:

```bash
# Required for production ping service
NODE_ENV=production

# Your Render app URL (get this from Render dashboard)
RENDER_EXTERNAL_URL=https://your-app-name.onrender.com

# Alternative frontend URL
FRONTEND_URL=https://your-frontend.com
```

### 2. Deploy to Render

1. Push your code to GitHub
2. Connect your repository to Render
3. Set the environment variables in Render dashboard
4. Deploy

### 3. Verify Ping Service

Check your server logs for:
```
Starting ping service to keep server alive...
✅ Server pinged successfully at [timestamp]
```

## Ping Endpoints

Your server now has these endpoints:

- `/ping` - Simple ping response
- `/health` - Health check with database status
- `/status` - Basic server status

## Alternative Solutions

### 1. External Monitoring Services

You can also use external services to ping your server:

- **UptimeRobot** - Free uptime monitoring
- **Cron-job.org** - Free cron job service
- **GitHub Actions** - Automated workflows

### 2. GitHub Actions Example

Create `.github/workflows/ping.yml`:

```yaml
name: Ping Server
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Server
        run: |
          curl -f https://your-app.onrender.com/ping
```

## Troubleshooting

### Server Still Sleeping?

1. Check if `NODE_ENV=production` is set
2. Verify `RENDER_EXTERNAL_URL` is correct
3. Check server logs for ping service messages
4. Ensure the ping service started successfully

### Ping Service Not Starting?

1. Verify environment variables
2. Check if running in production mode
3. Look for error messages in logs
4. Ensure all dependencies are installed

### Manual Testing

Test your ping endpoint manually:

```bash
curl https://your-app.onrender.com/ping
```

Expected response:
```json
{
  "message": "pong",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## Dependencies Cleaned

Removed unused dependencies:
- ❌ `jspdf` - Not used in backend
- ❌ `jspdf-autotable` - Not used in backend  
- ❌ `puppeteer` - Not used in backend
- ❌ `nodemon` - Moved to devDependencies

## Support

If you encounter issues:
1. Check server logs for error messages
2. Verify environment variables
3. Test ping endpoints manually
4. Ensure Render service is properly configured
