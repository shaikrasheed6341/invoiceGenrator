import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import authmiddle from "./authmiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

// Get bank details count for the current user
router.get("/bankdetails/count", authmiddle, async (req, res) => {
  try {
    // Find the owner for the current user
    const owner = await prisma.owner.findUnique({
      where: { userId: req.userId },
      include: { bankDetails: true }
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found for this user." });
    }

    const count = owner.bankDetails.length;

    return res.json({ 
      message: "Bank accounts count retrieved successfully",
      count: count,
      bankAccounts: count
    });
  } catch (err) {
    console.error("Error counting bank accounts:", err);
    return res.status(500).json({ 
      message: "Error counting bank accounts", 
      error: err.message 
    });
  }
});

// Get bank details for authenticated user
router.get("/bankdetails", authmiddle, async (req, res) => {
    try {
        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId },
            include: {
                bankDetails: true
            }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        // If no bank details found, check for orphaned records and link them
        if (owner.bankDetails.length === 0) {
            const orphanedBankDetails = await prisma.bankDetails.findMany({
                where: {
                    ownerId: null
                }
            });

            if (orphanedBankDetails.length > 0) {
                // Link orphaned bank details to this owner
                await prisma.bankDetails.updateMany({
                    where: {
                        ownerId: null
                    },
                    data: {
                        ownerId: owner.id
                    }
                });

                // Fetch updated bank details
                const updatedOwner = await prisma.owner.findUnique({
                    where: { userId: req.userId },
                    include: {
                        bankDetails: true
                    }
                });

                return res.json({
                    message: "Bank details retrieved successfully",
                    bankDetails: updatedOwner.bankDetails
                });
            }
        }

        return res.json({
            message: "Bank details retrieved successfully",
            bankDetails: owner.bankDetails
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ 
            message: "Error retrieving bank details", 
            error: err.message 
        });
    }
});

//http://localhost:5000/bank/bankdetails
router.post("/bankdetails", authmiddle, async (req, res) => {
    const { name, ifsccode, accountno, bank, upid, upidname } = req.body;
    
    try {
        if (!name || !ifsccode || !accountno || !bank || !upid || !upidname) {
            return res.status(400).json({ message: "Fill all input fields" });
        }

        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        const result = await prisma.bankDetails.create({
            data: {
                name,
                ifsccode,
                accountno,
                bank,
                upid,
                upidname,
                ownerId: owner.id // Link to the owner
            }
        });

        console.log(result);
        return res.json({
            message: "Bank details created successfully",
            bankDetails: result
        });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ 
            message: "Error with bank server", 
            error: err.message 
        });
    }
});

// Update a specific bank detail for the current user
router.put("/bankdetails/:id", authmiddle, async (req, res) => {
  const { id } = req.params;
  const { name, ifsccode, accountno, bank, upid, upidname } = req.body;

  try {
    // Find the owner for the current user
    const owner = await prisma.owner.findUnique({
      where: { userId: req.userId }
    });
    if (!owner) {
      return res.status(404).json({ message: "Owner not found for this user." });
    }

    // Ensure the bank detail belongs to this owner
    const bankDetail = await prisma.bankDetails.findUnique({
      where: { id }
    });
    if (!bankDetail || bankDetail.ownerId !== owner.id) {
      return res.status(403).json({ message: "Not authorized to update this bank detail." });
    }

    // Update the bank detail
    const updated = await prisma.bankDetails.update({
      where: { id },
      data: { name, ifsccode, accountno, bank, upid, upidname }
    });

    return res.json({ message: "Bank detail updated successfully", bankDetails: updated });
  } catch (err) {
    console.error("Error updating bank detail:", err);
    return res.status(500).json({ message: "Error updating bank detail", error: err.message });
  }
});

// Delete a specific bank detail for the current user
router.delete("/bankdetails/:id", authmiddle, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the owner for the current user
    const owner = await prisma.owner.findUnique({
      where: { userId: req.userId }
    });
    if (!owner) {
      return res.status(404).json({ message: "Owner not found for this user." });
    }

    // Ensure the bank detail belongs to this owner
    const bankDetail = await prisma.bankDetails.findUnique({
      where: { id }
    });
    if (!bankDetail || bankDetail.ownerId !== owner.id) {
      return res.status(403).json({ message: "Not authorized to delete this bank detail." });
    }

    // Delete the bank detail
    await prisma.bankDetails.delete({
      where: { id }
    });

    return res.json({ message: "Bank detail deleted successfully" });
  } catch (err) {
    console.error("Error deleting bank detail:", err);
    return res.status(500).json({ message: "Error deleting bank detail", error: err.message });
  }
});

export default router;