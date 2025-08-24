import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const secretkey = process.env.JWT_SECRET || "shaikraheed";
const prisma = new PrismaClient();
const router = express.Router();

// Verify JWT token - http://localhost:5000/auth/verify
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, secretkey);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: {
                owner: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user is still active
        if (!user.isActive) {
            return res.status(403).json({ message: "Account is deactivated" });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                isActive: user.isActive,
                lastLoginAt: user.lastLoginAt,
                owner: user.owner ? {
                    id: user.owner.id,
                    name: user.owner.name,
                    email: user.owner.email,
                    phone: user.owner.phone,
                    gstNumber: user.owner.gstNumber,
                    compneyname: user.owner.compneyname,
                    recipientName: user.owner.recipientName,
                    houseNumber: user.owner.houseNumber,
                    streetName: user.owner.streetName,
                    locality: user.owner.locality,
                    city: user.owner.city,
                    pinCode: user.owner.pinCode,
                    state: user.owner.state,
                    invoiceInstructions: user.owner.invoiceInstructions
                } : null
            }
        });

    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        console.error('Token verification error:', err);
        return res.status(500).json({ message: "Token verification failed" });
    }
});

// Logout route - http://localhost:5000/auth/logout
router.post('/logout', (req, res) => {
    // Since we're using JWT, we just return success
    // The frontend should remove the token
    return res.status(200).json({ message: "Logged out successfully" });
});

export default router;
