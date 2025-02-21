import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();







// ✅ Create a new owner
router.post("/insertownerdata", async (req, res) => {
  try {
    const { name, email, phone, gstNumber, compneyname, address } = req.body; // Fixed `compneyname` typo

    if (!name || !email || !phone || !gstNumber || !compneyname || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const owner = await prisma.owner.create({
      data: { name, email, phone, gstNumber, compneyname, address },
    });

    return res.json({ message: "Your data was successfully stored", owner });
  } catch (error) {
    console.error("Error creating owner:", error);
    return res.status(500).json({ message: "Error creating owner" });
  }
});


//http://localhost:5000/owners/john@example.com
router.put("/:email", async(req,res)=>{
  const{email} =  req.params;
  const {name,phone,gstNumber,compneyname,address} =req.body;
  try{
   const existowner = await prisma.owner.findUnique({
     where:{
       email:email
     }
   })
   if(!existowner){
    return res.status(400).json({message:"user not exist"});
   }
   const updateownerdata = await prisma.owner.update({
     where:{email},
     data:{name, phone,gstNumber,compneyname,address }
   })
   return res.status(200).json({message:`your data is sucessfully updated ${updateownerdata}`})

  }catch(err){
   console.log(err);
   return res.status(500).json({message:`something wrong went to while updateing ${err.message}`})
  }

})


//http://localhost:5000/owners/allownerdata
router.get("/allownerdata", async (req, res) => {
  try {
    const owners = await prisma.owner.findMany();
    return res.json(owners);
  } catch (error) {
    return res.status(500).json({ message: `Server error ${error.message}` });
  }
});

// ✅ Get owner by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const ownering = await prisma.owner.findUnique({
      where: { id: String(id) }
    });

    if (!ownering) {  
      return res.status(404).json({ message: "Owner not found" });
    }

    res.json(ownering);
  } catch (error) {
    console.error("Error finding owner:", error);
    return res.status(500).json({ message: "Server error" });
  }
});



// ✅ Get all owners


export default router;
