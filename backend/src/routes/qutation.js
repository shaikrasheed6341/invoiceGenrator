import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();
//http://localhost:5000/quation/data
router.post("/data", async (req, res) => {
    const { number, ownerId, customerId, itemIds, bankdetailsId } = req.body;
    const parsedNumber = parseInt(number, 10);

    try {
        if (isNaN(parsedNumber)) {
            return res.status(400).json({ message: "Quotation number must be a valid integer." });
        }
        if (!number || !ownerId || !customerId || !itemIds || !bankdetailsId) {
            return res.status(400).json({ message: "All input fields are required." });
        }

        if (!Array.isArray(itemIds) || itemIds.length === 0) {
            return res.status(400).json({ message: "itemIds must be a non-empty array." });
        }

        // Ensure bankdetailsId exists
        const bankExists = await prisma.bankDetails.findUnique({
            where: { id: bankdetailsId },
        });

        if (!bankExists) {
            return res.status(404).json({ message: "Bank details not found." });
        }

        // Ensure all item IDs exist
        const existingItems = await prisma.item.findMany({
            where: { id: { in: itemIds } },
            select: { id: true },
        });

        if (existingItems.length !== itemIds.length) {
            return res.status(404).json({ message: "Some items not found." });
        }

        // Create quotation with multiple items
        const quotation = await prisma.quotation.create({
            data: {
                number:parsedNumber,
                ownerId,
                customerId,
                bankdetailsId,
                items: {
                    create: itemIds.map((itemId) => ({
                        item: { connect: { id: itemId } },
                        quantity: 1, // Adjust quantity if needed
                    })),
                },
            },
            include: {
                owner: true,
                customer: true,
                items: { include: { item: true } },
                bankdetails: true,
            },
        });

        return res.status(201).json(quotation);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: `An error occurred: ${err.message}` });
    }
});



//http://localhost:5000/quation/getdata/102

router.get("/getdata/:number", async (req, res) => {
    const { number } = req.params;
    try {
        const quationnumber = parseInt(req.params.number, 10);
        if (isNaN(quationnumber)) {
            return res.status(400).json({ message: "Invalid quotation number" });
        }
        const finalresult = await prisma.quotation.findUnique({
            where: { number: quationnumber },
            include: {
                owner: true,
                customer: true,
                items: {  // ✅ Use 'items' if the relationship is one-to-many
                    include: {
                        item: true, // ✅ Include item details inside items
                    },
                },
                bankdetails: true
            }

        })
        if (!finalresult) {
            return res.json({ message: "No data found for this quotation number" })
        }
        console.log(finalresult)
        return res.status(200).json(finalresult)
    } catch (err) {
        console.log(err)
        return res.json({ message: `yourgetting data also faild ${err.message}` })
    }
})
export default router;