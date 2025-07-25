import express from 'express';
import { PrismaClient } from '@prisma/client';
import authmiddle from './authmiddleware.js';

const prisma = new PrismaClient();
const router = express.Router();

//http://localhost:5000/custmor/345678456
router.put('/:phone', async (req, res) => {
    const { phone } = req.params;
    const { name, address,gstnumber,pannumber } = req.body;
    try {
        const existcustmer = await prisma.customer.findUnique({
            where: { phone }
        })
        if (!existcustmer) {
            return   res.status(500).json({ message: "this custmer not exist" });
        }
        const updatecustmer = await prisma.customer.update({
            where: { phone },
            data: { name, address,gstnumber,pannumber}
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
        const { name, address, phone, gstnumber, pannumber } = req.body;

        if (!name || !address || !phone || !gstnumber || !pannumber) {
            return res.status(400).json({ message: "You need to fill all inputs" });
        }

        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        const customer = await prisma.customer.create({
            data: {
                name,
                address,
                phone,
                gstnumber,
                pannumber,
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


//http://localhost:5000/custmor/475879
router.get("/:phone", async (req, res) => {
    const { phone } = req.params;
    try {
        const customer = await prisma.customer.findUnique({
            where: { phone: String(phone) }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer is not found" });
        }

       return res.status(200).json(customer);

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
        
        return res.json(customers);
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