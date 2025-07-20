import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const secretkey = "shaikraheed";

// Google OAuth login route
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google OAuth callback route
router.get('/google/callback', 
    passport.authenticate('google', { session: false }),
    (req, res) => {
        try {
            const user = req.user;
            
            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email }, 
                secretkey, 
                { expiresIn: "365d" }
            );

            // Redirect to frontend with token
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
        } catch (error) {
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
        }
    }
);

// Verify token route
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, secretkey);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, firstname: true, lastname: true, avatar: true }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        res.json({ user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// Test route to verify configuration
router.get('/test', (req, res) => {
    res.json({ 
        message: 'Google Auth is configured',
        clientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
        backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
    });
});

export default router; 