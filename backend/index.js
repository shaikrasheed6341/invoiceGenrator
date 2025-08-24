import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import session from 'express-session';
import ownerRoutes from "./src/routes/ownerRoutes.js";
import customerRoutes from "./src/routes/custmorRoutes.js";
import itemsRoutes from "./src/routes/itemsRoutes.js";
import quotationRoutes from "./src/routes/qutation.js";
import bankDetailsRoutes from "./src/routes/bankdetails.js";
import googleAuthRoutes from "./src/routes/googleAuth.js";
import analyticsRoutes from "./src/routes/analytics.js";
import healthRoutes from "./health.js";
import PingService from "./src/services/pingService.js";

import ownerImageUploadRoutes from "./src/routes/ownerImageUpload.js";
import loginRoutes from "./src/routes/loginRoute.js";
import registerRoutes from "./src/routes/registerRoute.js";
import authVerificationRoutes from "./src/routes/authVerification.js";
import passport from "./src/config/googleAuth.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
// CORS configuration for development and production
let corsOptions;

if (process.env.NODE_ENV === 'production') {
    // Production CORS - specific origins only
    corsOptions = {
        origin: [
            'https://invoice-genrator-ruddy.vercel.app',
            'https://invoicegenrator.onrender.com',
            process.env.FRONTEND_URL
        ].filter(Boolean),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
    };
} else {
    // Development CORS - allow local development
    corsOptions = {
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000'
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
    };
}

console.log('🌐 CORS configured for:', process.env.NODE_ENV || 'development');
console.log('📍 Allowed origins:', corsOptions.origin);

app.use(cors(corsOptions));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize passport
app.use(passport.initialize());

// Health check routes (for monitoring)
app.use("/", healthRoutes);

// Authentication routes
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);

app.use("/quotation", quotationRoutes);
app.use("/customer", customerRoutes);
app.use("/owners", ownerRoutes);
app.use("/iteam", itemsRoutes);
app.use("/bank", bankDetailsRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/auth", authVerificationRoutes);
app.use("/analytics", analyticsRoutes);

app.use("/owner-images", ownerImageUploadRoutes);

const port = process.env.PORT || 5000;
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.listen(port, host, () => {
    console.log(`🚀 Server running on ${host}:${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Using default'}`);
    
    // Start ping service to keep server alive on Render free tier
    if (process.env.NODE_ENV === 'production') {
        console.log('🏗️ Production mode: Starting ping service...');
        const pingService = new PingService();
        pingService.start();
        
        // Store reference for graceful shutdown
        app.locals.pingService = pingService;
    } else {
        console.log('💻 Development mode: Ping service disabled');
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    if (app.locals.pingService) {
        app.locals.pingService.stop();
    }
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    if (app.locals.pingService) {
        app.locals.pingService.stop();
    }
    process.exit(0);
});

export default app;
