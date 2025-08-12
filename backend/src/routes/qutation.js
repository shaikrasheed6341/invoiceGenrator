import express from "express";
import { PrismaClient } from "@prisma/client";
import authmiddle from './authmiddleware.js';
import encryptionService from '../services/workingDecryptionService.js';

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
    console.log("=== QUOTATION DATA ROUTE CALLED ===");
    console.log("Request body:", req.body);
    
    const { number, owneremail, customerphone, itemNames, itemQuantities, itemTaxes, bankdetailsaccountno } = req.body;
    const parsedNumber = parseInt(number, 10);
    
    console.log("Extracted data:");
    console.log("- number:", number, "(parsed:", parsedNumber, ")");
    console.log("- owneremail:", owneremail);
    console.log("- customerphone:", customerphone);
    console.log("- bankdetailsaccountno:", bankdetailsaccountno);
    console.log("- itemNames:", itemNames);
    console.log("- itemQuantities:", itemQuantities);
    console.log("- itemTaxes:", itemTaxes);

    try {
        // Validate inputs
        if (isNaN(parsedNumber)) {
            console.log("❌ Validation failed: Quotation number is not a valid integer");
            return res.status(400).json({ message: "Quotation number must be a valid integer." });
        }
        if (!number || !owneremail || !customerphone || !itemNames || !itemQuantities || !bankdetailsaccountno) {
            console.log("❌ Validation failed: Missing required fields");
            console.log("- number exists:", !!number);
            console.log("- owneremail exists:", !!owneremail);
            console.log("- customerphone exists:", !!customerphone);
            console.log("- itemNames exists:", !!itemNames);
            console.log("- itemQuantities exists:", !!itemQuantities);
            console.log("- bankdetailsaccountno exists:", !!bankdetailsaccountno);
            return res.status(400).json({ message: "All input fields are required." });
        }
        if (!Array.isArray(itemNames) || itemNames.length === 0) {
            console.log("❌ Validation failed: itemNames is not a valid array");
            return res.status(400).json({ message: "itemNames must be a non-empty array." });
        }
        if (!Array.isArray(itemQuantities) || itemQuantities.length !== itemNames.length) {
            console.log("❌ Validation failed: itemQuantities array length mismatch");
            return res.status(400).json({ message: "Each item must have a corresponding quantity." });
        }

        console.log("✅ Basic validation passed");

        // Fetch existing owner - need to decrypt email for comparison
        console.log("🔍 Looking for owner with email:", owneremail);
        
        // Get all owners to decrypt and compare
        const allOwners = await prisma.owner.findMany({
            select: { id: true, email: true },
        });
        
        console.log("All owners found:", allOwners);
        
        // Decrypt owner emails to find a match
        let ownerExist = null;
        for (const owner of allOwners) {
            try {
                // Use decrypt method directly for single string values
                const decryptedEmail = encryptionService.decrypt(owner.email);
                console.log(`Owner ${owner.id}: encrypted email = ${owner.email}, decrypted email = ${decryptedEmail}`);
                
                if (decryptedEmail === owneremail) {
                    ownerExist = owner;
                    console.log("✅ Found matching owner!");
                    break;
                }
            } catch (decryptError) {
                console.log("Could not decrypt owner email:", owner.email, "Error:", decryptError.message);
                // If decryption fails, try direct comparison (for non-encrypted emails)
                if (owner.email === owneremail) {
                    ownerExist = owner;
                    console.log("✅ Found matching owner (direct comparison)!");
                    break;
                }
            }
        }
        
        if (!ownerExist) {
            console.log("❌ Owner not found with email:", owneremail);
            console.log("Available owners (encrypted):", allOwners);
            return res.status(404).json({ message: "Owner details not found." });
        }
        console.log("✅ Owner found with ID:", ownerExist.id);

        // Fetch existing customer - need to decrypt phone numbers for comparison
        console.log("🔍 Looking for customer with phone:", customerphone, "and ownerId:", ownerExist.id);
        
        // Get all customers for this owner to decrypt and compare
        const allCustomers = await prisma.customer.findMany({
            where: { ownerId: ownerExist.id },
            select: { id: true, phone: true },
        });
        
        console.log("All customers for this owner:", allCustomers);
        
        // Decrypt customer phone numbers to find a match
        let customerExist = null;
        for (const customer of allCustomers) {
            try {
                // Use decrypt method directly for single string values
                const decryptedPhone = encryptionService.decrypt(customer.phone);
                console.log(`Customer ${customer.id}: encrypted phone = ${customer.phone}, decrypted phone = ${decryptedPhone}`);
                
                if (decryptedPhone === customerphone) {
                    customerExist = customer;
                    console.log("✅ Found matching customer!");
                    break;
                }
            } catch (decryptError) {
                console.log("Could not decrypt customer phone:", customer.phone, "Error:", decryptError.message);
                // If decryption fails, try direct comparison (for non-encrypted phones)
                if (customer.phone === customerphone) {
                    customerExist = customer;
                    console.log("✅ Found matching customer (direct comparison)!");
                    break;
                }
            }
        }
        
        if (!customerExist) {
            console.log("❌ Customer not found with phone:", customerphone, "for owner:", ownerExist.id);
            console.log("Available customers (encrypted):", allCustomers);
            return res.status(404).json({ message: "Customer details not found." });
        }
        console.log("✅ Customer found with ID:", customerExist.id);

        // Fetch existing bank details - need to decrypt account numbers for comparison
        console.log("🔍 Looking for bank details with accountno:", bankdetailsaccountno, "and ownerId:", ownerExist.id);
        
        // Get all bank details for this owner to decrypt and compare
        const allBankDetails = await prisma.bankDetails.findMany({
            where: { ownerId: ownerExist.id },
            select: { id: true, accountno: true },
        });
        
        console.log("All bank details for this owner:", allBankDetails);
        
        // Decrypt bank account numbers to find a match
        let bankExists = null;
        for (const bankDetail of allBankDetails) {
            try {
                // Use decrypt method directly for single string values
                const decryptedAccount = encryptionService.decrypt(bankDetail.accountno);
                console.log(`Bank detail ${bankDetail.id}: encrypted accountno = ${bankDetail.accountno}, decrypted accountno = ${decryptedAccount}`);
                
                if (decryptedAccount === bankdetailsaccountno) {
                    bankExists = bankDetail;
                    console.log("✅ Found matching bank details!");
                    break;
                }
            } catch (decryptError) {
                console.log("Could not decrypt bank account:", bankDetail.accountno, "Error:", decryptError.message);
                // If decryption fails, try direct comparison (for non-encrypted account numbers)
                if (bankDetail.accountno === bankdetailsaccountno) {
                    bankExists = bankDetail;
                    console.log("✅ Found matching bank details (direct comparison)!");
                    break;
                }
            }
        }
        
        if (!bankExists) {
            console.log("❌ Bank details not found with accountno:", bankdetailsaccountno, "for owner:", ownerExist.id);
            console.log("Available bank details (encrypted):", allBankDetails);
            return res.status(404).json({ message: "Bank details not found." });
        }
        console.log("✅ Bank details found with ID:", bankExists.id);

        // Fetch existing items - need to decrypt item names for comparison
        console.log("🔍 Looking for items with names:", itemNames, "and ownerId:", ownerExist.id);
        
        // Get all items for this owner to decrypt and compare
        const allItems = await prisma.item.findMany({
            where: { ownerId: ownerExist.id },
            select: { id: true, name: true },
        });
        
        console.log("All items for this owner:", allItems);
        
        // Decrypt item names to find matches
        const existingItems = [];
        for (const item of allItems) {
            try {
                // Use decrypt method directly for single string values
                const decryptedName = encryptionService.decrypt(item.name);
                console.log(`Item ${item.id}: encrypted name = ${item.name}, decrypted name = ${decryptedName}`);
                
                if (itemNames.includes(decryptedName)) {
                    existingItems.push({
                        id: item.id,
                        name: decryptedName
                    });
                    console.log("✅ Found matching item:", decryptedName);
                }
            } catch (decryptError) {
                console.log("Could not decrypt item name:", item.name, "Error:", decryptError.message);
                // If decryption fails, try direct comparison (for non-encrypted items)
                if (itemNames.includes(item.name)) {
                    existingItems.push({
                        id: item.id,
                        name: item.name
                    });
                    console.log("✅ Found matching item (direct comparison):", item.name);
                }
            }
        }

        console.log("Existing Items (decrypted):", existingItems);
        console.log("Sent itemNames:", itemNames);

        // Ensure all items exist in the database
        const foundItemNames = existingItems.map((item) => item.name);
        const missingItems = itemNames.filter((name) => !foundItemNames.includes(name));

        if (missingItems.length > 0) {
            console.log("❌ Missing items:", missingItems);
            console.log("Available items (encrypted):", allItems);
            return res.status(404).json({ message: `Items not found: ${missingItems.join(", ")}` });
        }
        console.log("✅ All items found");

        console.log("🚀 Creating quotation...");
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

        console.log("✅ Quotation created successfully:", quotation.id);

        // Decrypt sensitive data in quotation response
        const decryptedQuotation = {
            ...quotation,
            owner: quotation.owner ? encryptionService.decryptOwnerDetails(quotation.owner) : null,
            customer: quotation.customer ? encryptionService.decryptCustomerDetails(quotation.customer) : null,
            bankdetails: quotation.bankdetails ? encryptionService.decryptBankDetails(quotation.bankdetails) : null,
            items: quotation.items.map(item => ({
                ...item,
                item: item.item ? encryptionService.decryptObject(item.item, ['name', 'brand']) : null
            }))
        };

        console.log("✅ Decryption completed, sending response");
        return res.status(201).json(decryptedQuotation);
    } catch (err) {
        console.error("❌ Error in quotation creation:", err);
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

        // Decrypt sensitive data in quotations
        const decryptedQuotations = quotations.map(quotation => ({
            ...quotation,
            customer: quotation.customer ? encryptionService.decryptCustomerDetails(quotation.customer) : null,
            bankdetails: quotation.bankdetails ? encryptionService.decryptBankDetails(quotation.bankdetails) : null,
            items: quotation.items.map(item => ({
                ...item,
                item: item.item ? encryptionService.decryptObject(item.item, ['name', 'brand']) : null
            }))
        }));

        return res.status(200).json(decryptedQuotations);
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

        // Decrypt sensitive data in quotation
        const decryptedQuotation = {
            ...finalresult,
            owner: finalresult.owner ? encryptionService.decryptOwnerDetails(finalresult.owner) : null,
            customer: finalresult.customer ? encryptionService.decryptCustomerDetails(finalresult.customer) : null,
            bankdetails: finalresult.bankdetails ? encryptionService.decryptBankDetails(finalresult.bankdetails) : null,
            items: finalresult.items.map(item => ({
                ...item,
                item: item.item ? encryptionService.decryptObject(item.item, ['name', 'brand']) : null
            }))
        };

        console.log("Found quotation:", decryptedQuotation);
        return res.status(200).json(decryptedQuotation);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Failed to retrieve data: ${err.message}` });
    }
});

export default router;
