import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

router.post("/datas",async(req,res)=>{
    const{name,quantity,rate,tax,brand} = req.body;
    try{
         if(!name || !quantity || !rate || !tax ||!brand){
            console.log("require all input fields");
         
            res.status(400).json({message:"fill the all inut fields"});
         }
         const iteams =  await prisma.item.create({
            data:{
               name,
               brand,
               quantity,
               rate,
               tax
            }
         })
         res.status(200).json(iteams)

    }catch(err){
      res.status(500).json({message:`something went wrong ${err}`,err})
    }
    
})



//when you insert bulk dasta
//http://localhost:5000/iteam/insertcameras
router.post("/insertcameras", async (req, res) => {
    try {
        const cameras = req.body; // JSON data
        const insertedItems = await prisma.item.createMany({
            data: cameras,
            skipDuplicates: true // Prevents errors due to duplicate names
        });
        res.json({ message: "your data is sucessfully inserted", data: insertedItems });
    } catch (error) {
        console.error("Error inserting cameras:", error);
        res.status(500).json({ message: "Server error", error });
    }
});








export default router;