import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const secretkey = "shaikraheed";

// Create Google OAuth Strategy lazily
const createGoogleStrategy = () => {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!clientID || !clientSecret) {
        console.warn('⚠️  Google OAuth not configured - missing environment variables');
        return null;
    }
    
    // Determine the correct callback URL based on environment
    let callbackURL;
    if (process.env.NODE_ENV === 'production') {
        // In production, use RENDER_EXTERNAL_URL or fallback to the known production URL
        callbackURL = `${process.env.RENDER_EXTERNAL_URL || 'https://invoicegenrator.onrender.com'}/auth/google/callback`;
    } else {
        // In development, use localhost
        callbackURL = 'http://localhost:5000/auth/google/callback';
    }
    
    console.log('🔗 Google OAuth callback URL:', callbackURL);
    
    return new GoogleStrategy({
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: callbackURL
    }, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists by googleId
        let user = await prisma.user.findUnique({
            where: { googleId: profile.id }
        });

        if (!user) {
            // Check if user exists by email (for existing users who want to link Google account)
            const existingUserByEmail = await prisma.user.findUnique({
                where: { email: profile.emails[0].value }
            });

            if (existingUserByEmail) {
                // Update existing user with Google ID
                user = await prisma.user.update({
                    where: { id: existingUserByEmail.id },
                    data: {
                        googleId: profile.id,
                        avatar: profile.photos[0]?.value || existingUserByEmail.avatar
                    }
                });
            } else {
                // Create new user
                user = await prisma.user.create({
                    data: {
                        googleId: profile.id,
                        firstname: profile.name.givenName || '',
                        lastname: profile.name.familyName || '',
                        email: profile.emails[0].value,
                        avatar: profile.photos[0]?.value || null
                    }
                });
            }
        }

        return done(null, user);
    } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
    }
});
};

// Initialize Google OAuth strategy if environment variables are available
const googleStrategy = createGoogleStrategy();
if (googleStrategy) {
    passport.use(googleStrategy);
    console.log('✅ Google OAuth strategy initialized');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    console.log('🔗 Render URL:', process.env.BACKEND_URL || 'Not set');
} else {
    console.log('ℹ️  Google OAuth strategy not initialized - missing environment variables');
}

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport; 