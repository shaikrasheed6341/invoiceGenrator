# Invoice Generator Backend

A Node.js backend application for generating invoices and managing business operations.

## Features

- User authentication and authorization
- Customer management
- Invoice generation
- Quotation management
- Business analytics
- Google OAuth integration
- Supabase integration
- Prisma ORM with PostgreSQL

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Supabase account (for additional features)
- Google OAuth credentials

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment to Render

### Option 1: Using render.yaml (Recommended)

1. Push your code to a Git repository
2. Connect your repository to Render
3. Render will automatically detect the `render.yaml` file and configure the service
4. Set the required environment variables in Render dashboard

### Option 2: Manual Configuration

1. Create a new Web Service in Render
2. Connect your Git repository
3. Configure the service:
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`
   - **Environment**: Node

### Required Environment Variables

Set these in your Render dashboard:

- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for sessions
- `FRONTEND_URL`: Your frontend application URL
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

### Database Setup

1. Create a PostgreSQL database in Render or use an external provider
2. Update the `DATABASE_URL` environment variable
3. The application will automatically run migrations on startup

## Health Checks

The application includes health check endpoints:

- `GET /health`: Comprehensive health check with database connectivity
- `GET /status`: Simple status endpoint

## Scripts

- `npm start`: Start the production server
- `npm run dev`: Start development server with nodemon
- `npm run build`: Generate Prisma client
- `npm run encrypt-data`: Encrypt existing data
- `npm run decrypt-all`: Decrypt all data

## API Endpoints

- `/quotation` - Quotation management
- `/customer` - Customer management
- `/owners` - Business owner management
- `/iteam` - Item/product management
- `/bank` - Bank details management
- `/auth` - Authentication routes
- `/analytics` - Business analytics
- `/owner-images` - Image upload for owners

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure `DATABASE_URL` is correct and accessible
2. **Prisma Migrations**: Run `npx prisma migrate deploy` in production
3. **Environment Variables**: Verify all required variables are set in Render
4. **Port Binding**: The app automatically binds to `0.0.0.0` in production

### Logs

Check Render logs for detailed error information and application status.

## Support

For deployment issues, check the Render documentation and ensure all environment variables are properly configured.
