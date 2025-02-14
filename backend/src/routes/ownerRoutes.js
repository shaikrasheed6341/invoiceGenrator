import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Create a new owner
router.post("/insertownerdata", async (req, res) => {
  try {
    const { name, email,phone,gstNumber } = req.body;

    if (!name || !email || !phone || !gstNumber) {
      return res.status(400).json({ message: "Name and email  phone gstnumber are required" });
    }

    const owner = await prisma.owner.create({
      data: { name, email ,phone,gstNumber},
    });

    res.json({message : "your data sucess fullystored ",owner});
  } catch (error) {
    console.error("Error creating owner:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//get with id
router.get("/ownerdata/:id",async(req,res)=>{
    const{id} = req.params;
    try{
        const owner = await prisma.owner.findUnique({
            where:{id:String(id)}
        })
        if(!owner){
            res.json({message:"owner is not found"})
        }
        res.json(owner)
    }catch(err){
        console.log("error find ing owner",err);
        res.status(500).json({message:"server error"})
    }
    

})

// Get all owners
router.get("/allownerdata", async (req, res) => {
  try {
    const owners = await prisma.owner.findMany();
    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
