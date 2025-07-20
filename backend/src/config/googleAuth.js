import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secretkey = "shaikraheed";

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/google/callback`
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
}));

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