import express from "express";
import { PrismaClient } from "@prisma/client";
import authmiddle from './authmiddleware.js';

const prisma = new PrismaClient();

const router = express.Router();

//when you insesert sigle data
//http://localhost:5000/iteam/datas
// router.post("/datas", async (req, res) => {
//     const { name, quantity, rate, tax, brand } = req.body;
    
//     try {
//         if (!name || !quantity || !rate || !tax || !brand) {
//             console.log("Require all input fields");
//             return res.status(400).json({ message: "Fill all input fields" }); // ✅ return added
//         }

//         const item = await prisma.item.create({
//             data: {
//                 name,
//                 brand,
//                 quantity,
//                 rate,
//                 tax,
//             },
//         });

//         return res.status(200).json(item); // ✅ Return here ensures only one response is sent

//     } catch (err) {
//         console.error("Error creating item:", err);
//         return res.status(500).json({ message: `Something went wrong: ${err.message}`, error: err });
//     }
// });
router.post("/datas", authmiddle, async (req, res) => {
    console.log("Received request body:", req.body); // Debugging

    const { name, rate, tax, brand } = req.body; // Removed quantity from destructuring

    if (!name?.trim() || !brand?.trim() || !rate || !tax) {
        console.log("Require all input fields except quantity");
        return res.status(400).json({ message: "Fill all input fields (name, brand, rate, tax) with valid values" });
    }

    try {
        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        // Validate numeric fields
        const rateValue = parseFloat(rate);
        const taxValue = parseInt(tax, 10);
        
        if (isNaN(rateValue) || isNaN(taxValue)) {
            return res.status(400).json({ message: "Rate and tax must be valid numbers" });
        }

        const item = await prisma.item.create({
            data: {
                name,
                brand,
                quantity: null, // Always set to null as quantity is hidden
                rate: rateValue,
                tax: taxValue,
                ownerId: owner.id // Link to the owner
            },
        });

        return res.status(200).json(item);
    } catch (err) {
        console.error("Error creating item:", err);
        return res.status(500).json({ message: `Something went wrong: ${err.message}` });
    }
});


//http://localhost:5000/iteam/getalliteamdata
router.get("/getalliteamdata", authmiddle, async (req, res) => {
    try {
        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        // Get items for this owner
        const result = await prisma.item.findMany({
            where: { ownerId: owner.id }
        });
        
        return res.json(result);
    } catch (err) {
        console.log(err);
        return res.json({ message: "Unable to fetch data", err });
    }
});

// New route to view all products in table format
//http://localhost:5000/iteam/viewproducts
router.get("/viewproducts", authmiddle, async (req, res) => {
    try {
        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        // Get all products for this owner with table format data
        const products = await prisma.item.findMany({
            where: { ownerId: owner.id },
            select: {
                id: true,
                name: true,
                brand: true,
                rate: true,
                tax: true,
                quantity: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        
        return res.json({
            success: true,
            message: "Products fetched successfully",
            data: products,
            total: products.length
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ 
            success: false,
            message: "Unable to fetch products", 
            error: err.message 
        });
    }
});

//when you insert bulk dasta
//http://localhost:5000/iteam/insertcameras
router.post("/insertcameras", authmiddle, async (req, res) => {
    try {
        const cameras = req.body; // JSON data
        
        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        // Add ownerId to each camera item
        const camerasWithOwner = cameras.map(camera => ({
            ...camera,
            ownerId: owner.id,
            quantity: null // Set quantity to null as it's hidden
        }));

        const insertedItems = await prisma.item.createMany({
            data: camerasWithOwner,
            skipDuplicates: true // Prevents errors due to duplicate names
        });
        return res.json({ message: "your data is successfully inserted", data: insertedItems });
    } catch (error) {
        console.error("Error inserting cameras:", error);
        return res.status(500).json({ message: "Server error", error });
    }
});

//http://localhost:5000/iteam/findbrand/Dell
router.get("/findbrand/:brand", authmiddle, async(req,res)=>{
    const{brand} = req.params;
    try{
        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        const finditeam = await prisma.item.findMany({
            where:{
                brand: brand,
                ownerId: owner.id
            }
        }) ; 
        return res.status(200).json(finditeam);

    }catch(err){
        console.log(err);
        return res.status(400).json({message:`error occur in iteam search ${err}`,err})
    }
})

//http://localhost:5000/iteam/update/Intel Core i5-10400F Processor
router.put("/update/:name", authmiddle, async(req,res)=>{
    const{name} = req.params;
    const {rate, tax, brand} = req.body; // Removed quantity from destructuring
    
    try{
        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        const existingiteam = await prisma.item.findFirst({
            where:{
                name: name,
                ownerId: owner.id
            },
        })
        
        if(!existingiteam){
          return res.status(400).json({message:"Product not found or you don't have permission to update it"})
        }
        
        // Validate numeric fields for update
        const rateValue = parseFloat(rate);
        const taxValue = parseInt(tax, 10);
        
        if (isNaN(rateValue) || isNaN(taxValue)) {
            return res.status(400).json({ message: "Rate and tax must be valid numbers" });
        }

        const updateiteam = await prisma.item.update({
            where :{id: existingiteam.id},
            data:{
                rate: rateValue,
                tax: taxValue,
                brand
            }, // Removed quantity from update
        })
       return res.json({message:"Product updated successfully", updateiteam});
    }catch(err){
        console.log("error update while iteam",err)
       return res.status(500).json({message:`error ${err.message}`})
    }
})

// New route to delete a product
//http://localhost:5000/iteam/delete/:id
router.delete("/delete/:id", authmiddle, async(req,res)=>{
    const{id} = req.params;
    
    try{
        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        const existingProduct = await prisma.item.findFirst({
            where:{
                id: parseInt(id),
                ownerId: owner.id
            },
        })
        
        if(!existingProduct){
          return res.status(400).json({message:"Product not found or you don't have permission to delete it"})
        }
        
        await prisma.item.delete({
            where :{id: parseInt(id)},
        })
       return res.json({message:"Product deleted successfully"});
    }catch(err){
        console.log("error deleting product",err)
       return res.status(500).json({message:`error ${err.message}`})
    }
})

export default router;