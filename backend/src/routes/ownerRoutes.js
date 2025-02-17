import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// ✅ Create a new owner
router.post("/insertownerdata", async (req, res) => {
  try {
    const { name, email, phone, gstNumber } = req.body;

    if (!name || !email || !phone || !gstNumber) {
      return res.status(400).json({ message: "Name, email, phone, and GST number are required" });
    }

    const owner = await prisma.owner.create({
      data: { name, email, phone, gstNumber },
    });

    return res.json({ message: "Your data was successfully stored", owner });
  } catch (error) {
    console.error("Error creating owner:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/allownerdata", async (req, res) => {
  try {
    const owners = await prisma.owner.findMany();
    return res.json(owners);
  } catch (error) {
    return res.status(500).json({ message: `Server error ${error.message}` });
  }
});

// ✅ Get owner by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const ownering = await prisma.owner.findUnique({
      where: { id: String(id) }
    });

    if (!ownering) {  
      return res.status(404).json({ message: "Owner not found" });
    }

    res.json(ownering);
  } catch (error) {
    console.error("Error finding owner:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all owners


export default router;
