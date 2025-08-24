import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const secretkey = process.env.JWT_SECRET || "shaikraheed";

const authmiddle = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, secretkey);
    
    // Get user with owner information
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        owner: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid token. User not found." });
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
};

export default authmiddle;
