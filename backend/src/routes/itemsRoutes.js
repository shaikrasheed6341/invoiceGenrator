import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

//when you insesert sigle data
//http://localhost:5000/iteam/datas
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

//http://localhost:5000/iteam/findbrand/Dell
router.get("/findbrand/:brand",async(req,res)=>{
    const{brand} = req.params;
    try{
        const finditeam = await prisma.item.findMany({
            where:{brand:brand}
        }) ; 
        res.status(200).json(finditeam);

    }catch(err){
        console.log(err);
        res.status(400).json({message:`error occur in iteam search ${err}`,err})
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
          res.status(400).json({message:"your name  is not exist"})
        }
        const updateiteam = await prisma.item.update({
            where :{name},
            data:{quantity,rate,tax,brand},
        })
        res.json({message:"iteam update sucessfully",updateiteam});
    }catch(err){
        console.log("error update while iteam",err)
        res.status(500).json({message:`error ${err.message}`})
    }
})




export default router;