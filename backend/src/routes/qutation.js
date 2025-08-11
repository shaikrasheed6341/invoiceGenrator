import express from "express";
import { PrismaClient } from "@prisma/client";
import authmiddle from './authmiddleware.js';

const prisma = new PrismaClient();
const router = express.Router();

// Get next available quotation number for current user
// http://localhost:5000/quotation/next-number
router.get("/next-number", authmiddle, async (req, res) => {
    try {
        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        // Get the highest quotation number for this owner
        const lastQuotation = await prisma.quotation.findFirst({
            where: { ownerId: owner.id },
            orderBy: { number: 'desc' }
        });

        // If no quotations exist, start with 1, otherwise increment the last number
        const nextNumber = lastQuotation ? lastQuotation.number + 1 : 1;

        return res.status(200).json({ nextNumber });
    } catch (err) {
        console.error("Error getting next quotation number:", err);
        return res.status(500).json({ message: `Failed to get next quotation number: ${err.message}` });
    }
});

// http://localhost:5000/quotation/data
router.post("/data", async (req, res) => {
    const { number, owneremail, customerphone, itemNames, itemQuantities, itemTaxes, bankdetailsaccountno } = req.body;
    const parsedNumber = parseInt(number, 10);

    try {
        // Validate inputs
        if (isNaN(parsedNumber)) {
            return res.status(400).json({ message: "Quotation number must be a valid integer." });
        }
        if (!number || !owneremail || !customerphone || !itemNames || !itemQuantities || !bankdetailsaccountno) {
            return res.status(400).json({ message: "All input fields are required." });
        }
        if (!Array.isArray(itemNames) || itemNames.length === 0) {
            return res.status(400).json({ message: "itemNames must be a non-empty array." });
        }
        if (!Array.isArray(itemQuantities) || itemQuantities.length !== itemNames.length) {
            return res.status(400).json({ message: "Each item must have a corresponding quantity." });
        }

        // Fetch existing owner
        const ownerExist = await prisma.owner.findUnique({
            where: { email: owneremail },
            select: { id: true },
        });
        if (!ownerExist) {
            return res.status(404).json({ message: "Owner details not found." });
        }

        // Fetch existing customer
        const customerExist = await prisma.customer.findFirst({
            where: { 
                phone: customerphone,
                ownerId: ownerExist.id
            },
            select: { id: true },
        });
        if (!customerExist) {
            return res.status(404).json({ message: "Customer details not found." });
        }

        // Fetch existing bank details
        const bankExists = await prisma.bankDetails.findFirst({
            where: { 
                accountno: bankdetailsaccountno,
                ownerId: ownerExist.id
            },
            select: { id: true },
        });
        if (!bankExists) {
            return res.status(404).json({ message: "Bank details not found." });
        }

        // Fetch existing items
        const existingItems = await prisma.item.findMany({
            where: { 
                name: { in: itemNames },
                ownerId: ownerExist.id
            },
            select: { id: true, name: true },
        });

        console.log("Existing Items:", existingItems);
        console.log("Sent itemNames:", itemNames);

        // Ensure all items exist in the database
        const foundItemNames = existingItems.map((item) => item.name);
        const missingItems = itemNames.filter((name) => !foundItemNames.includes(name));

        if (missingItems.length > 0) {
            return res.status(404).json({ message: `Items not found: ${missingItems.join(", ")}` });
        }

        // Create the quotation and link items correctly
        const quotation = await prisma.quotation.create({
            data: {
                number: parsedNumber,
                ownerId: ownerExist.id,
                customerId: customerExist.id,
                bankdetailsId: bankExists.id,
                items: {
                    create: existingItems.map((item, index) => ({
                        item: { connect: { id: item.id } },
                        quantity: itemQuantities[index] || 1, // Default to 1 if missing
                        tax: itemTaxes && itemTaxes[index] ? parseFloat(itemTaxes[index]) : 0, // Default to 0 if no tax provided
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

// http://localhost:5000/quotation/getdata
router.get("/getdata", authmiddle, async (req, res) => {
    try {
        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        // Get all quotations for this owner
        const quotations = await prisma.quotation.findMany({
            where: { ownerId: owner.id },
            include: {
                customer: true,
                bankdetails: true,
                items: {
                    include: {
                        item: true,
                    },
                },
            },
        });

        return res.status(200).json(quotations);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Failed to retrieve quotations: ${err.message}` });
    }
});

// http://localhost:5000/quotation/getdata/102
router.get("/getdata/:number", authmiddle, async (req, res) => {
    try {
        const quationnumber = parseInt(req.params.number, 10);
        if (isNaN(quationnumber)) {
            return res.status(400).json({ message: "Invalid quotation number" });
        }

        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        const finalresult = await prisma.quotation.findFirst({
            where: { 
                number: quationnumber,
                ownerId: owner.id // Ensure quotation belongs to authenticated user
            },
            include: {
                owner: true,
                customer: true,
                items: {
                    include: {
                        item: true,
                    },
                },
                bankdetails: true,
            },
        });

        if (!finalresult) {
            return res.status(404).json({ message: "No data found for this quotation number" });
        }

        console.log("Found quotation:", finalresult);
        return res.status(200).json(finalresult);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Failed to retrieve data: ${err.message}` });
    }
});

export default router;
