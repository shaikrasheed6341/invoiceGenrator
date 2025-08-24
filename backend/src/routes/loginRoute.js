import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const secretkey = process.env.JWT_SECRET || "shaikraheed";
const prisma = new PrismaClient();
const router = express.Router();

// http://localhost:5000/login/signin
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        const user = await prisma.user.findUnique({
            where: { email }
        });
        
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }
        
        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ message: "Account is deactivated. Please contact support." });
        }
        
        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            return res.status(423).json({ 
                message: "Account is temporarily locked due to too many failed attempts. Please try again later." 
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Increment failed login attempts
            await prisma.user.update({
                where: { id: user.id },
                data: { 
                    loginAttempts: user.loginAttempts + 1,
                    lockedUntil: user.loginAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null // Lock for 15 minutes after 5 failed attempts
                }
            });
            
            return res.status(401).json({ message: "Invalid password" });
        }
        
        // Reset login attempts on successful login
        await prisma.user.update({
            where: { id: user.id },
            data: { 
                loginAttempts: 0,
                lockedUntil: null,
                lastLoginAt: new Date()
            }
        });

        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            secretkey, 
            { expiresIn: "120d" }
        );

        // Fetch owner data for the user
        const owner = await prisma.owner.findUnique({
            where: { userId: user.id }
        });

        console.log('✅ User logged in:', user.email);
        return res.status(200).json({ 
            token,
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                owner: owner ? {
                    id: owner.id,
                    name: owner.name,
                    email: owner.email,
                    phone: owner.phone,
                    gstNumber: owner.gstNumber,
                    compneyname: owner.compneyname,
                    recipientName: owner.recipientName,
                    houseNumber: owner.houseNumber,
                    streetName: owner.streetName,
                    locality: owner.locality,
                    city: owner.city,
                    pinCode: owner.pinCode,
                    state: owner.state,
                    invoiceInstructions: owner.invoiceInstructions
                } : null
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

export default router;