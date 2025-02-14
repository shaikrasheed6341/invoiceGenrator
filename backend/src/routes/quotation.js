// src/routes/quotation.ts
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Create Quotation
router.post("/", async (req, res) => {
    const { ownerId, customerId, items } = req.body;
  
    try {
        const subtotal = items.reduce((acc, item) => acc + item.rate * item.quantity, 0);
        const totalTax = subtotal * 0.18; // 18% GST
        const totalAmount = subtotal + totalTax;
  
        const quotation = await prisma.quotation.create({
            data: {
                ownerId,
                customerId,
                subtotal,
                totalTax,
                totalAmount,
                items: {
                    create: items.map(item => ({
                        itemId: item.itemId,
                        quantity: item.quantity,
                        rate: item.rate,
                        tax: item.tax,
                        amount: item.amount
                    }))
                }
            }
        });
  
        res.json(quotation);
    } catch (error) {
        res.status(500).json({ error: "Error creating quotation" });
    }
});

// Get Quotations
router.get("/", async (req, res) => {
    const quotations = await prisma.quotation.findMany({
        include: { items: true, customer: true, owner: true }
    });
    res.json(quotations);
});

// Update Quotation
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { items } = req.body;

    try {
        const updatedQuotation = await prisma.quotation.update({
            where: { id },
            data: {
                items: {
                    deleteMany: {},
                    create: items.map(item => ({
                        itemId: item.itemId,
                        quantity: item.quantity,
                        rate: item.rate,
                        tax: item.tax,
                        amount: item.amount
                    }))
                }
            }
        });
        res.json(updatedQuotation);
    } catch (error) {
        res.status(500).json({ error: "Error updating quotation" });
    }
});

// Delete Quotation
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.quotation.delete({ where: { id } });
        res.json({ message: "Quotation deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting quotation" });
    }
});

export default router;
