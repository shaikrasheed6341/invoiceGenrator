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

import ownerImageUploadRoutes from "./src/routes/ownerImageUpload.js";
import passport from "./src/config/googleAuth.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

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

app.use("/quotation", quotationRoutes);
app.use("/customer", customerRoutes);
app.use("/owners", ownerRoutes);
app.use("/iteam", itemsRoutes);
app.use("/bank", bankDetailsRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/analytics", analyticsRoutes);

app.use("/owner-images", ownerImageUploadRoutes);

const port = process.env.PORT || 5000;
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.listen(port, host, () => {
    console.log(`Server running on ${host}:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

export default app;
