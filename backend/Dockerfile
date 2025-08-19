# Multi-stage build for production - ULTRA FAST BUILD
FROM node:18-alpine AS deps

# Install dumb-init and wget for proper signal handling and health checks
RUN apk add --no-cache dumb-init wget

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY prisma ./prisma/

# Install ONLY Prisma and its dependencies (much faster than all dev deps)
# Using npm install instead of npm ci for better caching
RUN npm install --no-audit --no-fund --prefer-offline prisma @prisma/client

# Generate Prisma client
RUN npx prisma generate

# Production stage
FROM node:18-alpine AS production

# Copy dumb-init and wget from deps stage
COPY --from=deps /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=deps /usr/bin/wget /usr/bin/wget

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies with aggressive optimization
RUN npm ci --only=production --prefer-offline --no-audit --no-fund --silent

# Copy Prisma generated client
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma

# Copy source code
COPY . .

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port (will be overridden by Render's $PORT)
EXPOSE 5000

# Health check - optimized for production
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-5000}/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "index.js"]
