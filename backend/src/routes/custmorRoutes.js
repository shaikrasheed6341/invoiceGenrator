import express from 'express';
import { PrismaClient } from '@prisma/client';
import authmiddle from './authmiddleware.js';
import encryptionService from '../services/workingDecryptionService.js';

const prisma = new PrismaClient();
const router = express.Router();

// Update customer by phone (authenticated route)
router.put('/update/:phone', authmiddle, async (req, res) => {
    const { phone } = req.params;
    const { 
        name, 
        gstnumber,
        pannumber,
        recipientName,
        houseNumber,
        streetName,
        locality,
        city,
        pinCode,
        state
    } = req.body;
    
    try {
        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        // Find customer by phone and owner
        const existingCustomer = await prisma.customer.findFirst({
            where: { 
                phone: phone,
                ownerId: owner.id
            }
        });
        
        if (!existingCustomer) {
            return res.status(404).json({ message: "Customer not found or you don't have permission to update this customer." });
        }

        // Encrypt sensitive data before updating
        const encryptedData = encryptionService.encryptCustomerDetails({
            name,
            phone,
            gstnumber,
            pannumber,
            recipientName,
            houseNumber,
            streetName,
            locality,
            city,
            pinCode,
            state
        });

        const updatedCustomer = await prisma.customer.update({
            where: { id: existingCustomer.id },
            data: { 
                name: encryptedData.name, 
                gstnumber: encryptedData.gstnumber,
                pannumber: encryptedData.pannumber,
                recipientName: encryptedData.recipientName,
                houseNumber: encryptedData.houseNumber,
                streetName: encryptedData.streetName,
                locality: encryptedData.locality,
                city: encryptedData.city,
                pinCode: encryptedData.pinCode,
                state: encryptedData.state
            }
        });
        
        console.log(updatedCustomer);
        return res.json({ 
            message: "Customer updated successfully", 
            customer: updatedCustomer 
        });

    } catch (err) {
        console.error("Error updating customer:", err);
        return res.status(500).json({ message: "Error updating customer", error: err.message });
    }
});

// Legacy route for backward compatibility (deprecated)
router.put('/:phone', async (req, res) => {
    const { phone } = req.params;
    const { 
        name, 
        gstnumber,
        pannumber,
        recipientName,
        houseNumber,
        streetName,
        locality,
        city,
        pinCode,
        state
    } = req.body;
    try {
        const existcustmer = await prisma.customer.findUnique({
            where: { phone }
        })
        if (!existcustmer) {
            return   res.status(500).json({ message: "this custmer not exist" });
        }
        const updatecustmer = await prisma.customer.update({
            where: { phone },
            data: { 
                name, 
                gstnumber,
                pannumber,
                recipientName,
                houseNumber,
                streetName,
                locality,
                city,
                pinCode,
                state
            }
        })
        console.log(updatecustmer)
        return res.json({ message: `sucesssfully updated custmer `,updatecustmer })



    } catch (err) {
        console.log(err);
        if (err.message) {
            return  res.status(500).json({ message: "custmer updatetion is went wrong" })
        }else{
            return  res.json(err)
        }
    }
})



//http://localhost:5000/customer/custmor
router.post("/custmor", authmiddle, async (req, res) => {
    try {
        const { 
            name, 
            phone, 
            gstnumber, 
            pannumber,
            recipientName,
            houseNumber,
            streetName,
            locality,
            city,
            pinCode,
            state
        } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: "Name and phone are required" });
        }

        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        // Encrypt sensitive data before storing
        const encryptedData = encryptionService.encryptCustomerDetails({
            name,
            phone,
            gstnumber,
            pannumber,
            recipientName,
            houseNumber,
            streetName,
            locality,
            city,
            pinCode,
            state
        });

        const customer = await prisma.customer.create({
            data: {
                name: encryptedData.name,
                phone: encryptedData.phone,
                gstnumber: encryptedData.gstnumber,
                pannumber: encryptedData.pannumber,
                recipientName: encryptedData.recipientName,
                houseNumber: encryptedData.houseNumber,
                streetName: encryptedData.streetName,
                locality: encryptedData.locality,
                city: encryptedData.city,
                pinCode: encryptedData.pinCode,
                state: encryptedData.state,
                ownerId: owner.id // Link to the owner
            }
        });
        
        console.log(customer);
        return res.json({ message: "Customer data stored successfully" });

    } catch (err) {
        console.error("Error creating customer:", err.message, err.stack);
        return res.status(500).json({ message: "Something went wrong while uploading", err });
    }
});


// Get customer by phone (authenticated route)
router.get("/get/:phone", authmiddle, async (req, res) => {
    const { phone } = req.params;
    try {
        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        const customer = await prisma.customer.findFirst({
            where: { 
                phone: String(phone),
                ownerId: owner.id
            }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Decrypt sensitive data before sending
        const decryptedCustomer = encryptionService.decryptCustomerDetails(customer);

       return res.status(200).json(decryptedCustomer);

    } catch (err) {
        console.error("Error fetching customer:", err);
        return res.status(500).json({ message: `An error occurred: ${err.message}`, err });
    }
});

// Legacy route for backward compatibility (deprecated)
router.get("/:phone", async (req, res) => {
    const { phone } = req.params;
    try {
        const customer = await prisma.customer.findUnique({
            where: { phone: String(phone) }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer is not found" });
        }

        // Decrypt sensitive data before sending
        const decryptedCustomer = encryptionService.decryptCustomerDetails(customer);

       return res.status(200).json(decryptedCustomer);

    } catch (err) {
        console.error("Error fetching customer:", err);
        return res.status(500).json({ message: `An error occurred: ${err.message}`, err });
    }
});


//http://localhost:5000/custmor/
router.get("/", authmiddle, async (req, res) => {
    try {
        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        // Get customers for this owner
        const customers = await prisma.customer.findMany({
            where: { ownerId: owner.id }
        });
        
        // Decrypt sensitive data for all customers before sending
        const decryptedCustomers = customers.map(customer => 
            encryptionService.decryptCustomerDetails(customer)
        );
        
        return res.json(decryptedCustomers);
    } catch (err) {
        console.error("Error fetching customers:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

//http://localhost:5000/customer/:id
router.delete("/:id", authmiddle, async (req, res) => {
    try {
        const { id } = req.params;

        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        // Check if customer exists and belongs to this owner
        const customer = await prisma.customer.findFirst({
            where: { 
                id: parseInt(id),
                ownerId: owner.id 
            }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found or you don't have permission to delete this customer." });
        }

        // Delete the customer
        await prisma.customer.delete({
            where: { id: parseInt(id) }
        });

        return res.json({ message: "Customer deleted successfully" });
    } catch (err) {
        console.error("Error deleting customer:", err);
        return res.status(500).json({ message: "Something went wrong while deleting customer" });
    }
});

export default router;