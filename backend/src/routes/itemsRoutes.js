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

    const { name, quantity, rate, tax, brand } = req.body;

    if (!name?.trim() || !brand?.trim() || !rate?.trim() || !tax?.trim()) {
        console.log("Require all input fields except quantity");
        return res.status(400).json({ message: "Fill all input fields (except quantity) with valid values" });
    }

    try {
        // Get the owner for the authenticated user
        const owner = await prisma.owner.findUnique({
            where: { userId: req.userId }
        });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found. Please register your business first." });
        }

        const item = await prisma.item.create({
            data: {
                name,
                brand,
                quantity: quantity ? parseInt(quantity, 10) : null, // ✅ Default to null if empty
                rate: parseFloat(rate),
                tax: parseInt(tax, 10),
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

//when you insert bulk dasta
//http://localhost:5000/iteam/insertcameras
router.post("/insertcameras", async (req, res) => {
    try {
        const cameras = req.body; // JSON data
        const insertedItems = await prisma.item.createMany({
            data: cameras,
            skipDuplicates: true // Prevents errors due to duplicate names
        });
        return  res.json({ message: "your data is sucessfully inserted", data: insertedItems });
    } catch (error) {
        console.error("Error inserting cameras:", error);
        return res.status(500).json({ message: "Server error", error });
    }
});

//http://localhost:5000/iteam/findbrand/Dell
router.get("/findbrand/:brand",async(req,res)=>{
    const{brand} = req.params;
    try{
        const finditeam = await prisma.item.findMany({
            where:{brand:brand}
        }) ; 
        return  res.status(200).json(finditeam);

    }catch(err){
        console.log(err);
        return   res.status(400).json({message:`error occur in iteam search ${err}`,err})
    }
})
//http://localhost:5000/iteam/update/Intel Core i5-10400F Processor
router.put("/update/:name",async(req,res)=>{
    const{name} =  req.params;
    const {quantity,rate,tax,brand} = req.body;
    try{
        const existingiteam = await prisma.item.findFirst({
            where:{name},
        })
        if(!existingiteam){
          return res.status(400).json({message:"your name  is not exist"})
        }
        const updateiteam = await prisma.item.update({
            where :{name},
            data:{quantity,rate,tax,brand},
        })
       return  res.json({message:"iteam update sucessfully",updateiteam});
    }catch(err){
        console.log("error update while iteam",err)
       return  res.status(500).json({message:`error ${err.message}`})
    }
})




export default router;