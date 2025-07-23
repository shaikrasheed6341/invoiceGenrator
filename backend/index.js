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

app.use("/quotation", quotationRoutes);
app.use("/customer", customerRoutes);
app.use("/owners", ownerRoutes);
app.use("/iteam", itemsRoutes);
app.use("/bank", bankDetailsRoutes);
app.use("/auth", googleAuthRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;
