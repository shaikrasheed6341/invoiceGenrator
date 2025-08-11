import express from "express";
import { PrismaClient } from "@prisma/client";
import authmiddle from "./authmiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

// Use auth middleware for all owner routes
router.use(authmiddle);

// Get current user's owner data
router.get("/myowner", async (req, res) => {
  try {
    const userId = req.userId;
    
    const owner = await prisma.owner.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found for this user" });
    }

    return res.json({ owner });
  } catch (error) {
    console.error("Error fetching owner data:", error);
    return res.status(500).json({ message: "Error fetching owner data", error: error.message });
  }
});

// Get invoice instructions for the current owner
router.get("/invoice-instructions", async (req, res) => {
  try {
    const userId = req.userId;
    
    const owner = await prisma.owner.findUnique({
      where: { userId },
      select: { id: true, invoiceInstructions: true }
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found for this user" });
    }

    return res.json({ 
      success: true,
      invoiceInstructions: owner.invoiceInstructions || "" 
    });
  } catch (error) {
    console.error("Error fetching invoice instructions:", error);
    return res.status(500).json({ message: "Error fetching invoice instructions", error: error.message });
  }
});

// Update invoice instructions for the current owner
router.put("/invoice-instructions", async (req, res) => {
  try {
    const userId = req.userId;
    const { invoiceInstructions } = req.body;

    if (invoiceInstructions === undefined) {
      return res.status(400).json({ message: "Invoice instructions are required" });
    }

    const owner = await prisma.owner.findUnique({
      where: { userId }
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found for this user" });
    }

    const updatedOwner = await prisma.owner.update({
      where: { userId },
      data: { invoiceInstructions },
      select: { id: true, invoiceInstructions: true }
    });

    return res.json({ 
      success: true,
      message: "Invoice instructions updated successfully",
      invoiceInstructions: updatedOwner.invoiceInstructions 
    });
  } catch (error) {
    console.error("Error updating invoice instructions:", error);
    return res.status(500).json({ message: "Error updating invoice instructions", error: error.message });
  }
});

router.post("/insertownerdata", async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      gstNumber, 
      compneyname, 
      recipientName,
      houseNumber,
      streetName,
      locality,
      city,
      pinCode,
      state
    } = req.body;
    const userId = req.userId;

    if (!name || !email || !phone || !gstNumber || !compneyname) {
      return res.status(400).json({ message: "Name, email, phone, GST number, and company name are required" });
    }

    // Only allow one owner per user
    const existingOwner = await prisma.owner.findUnique({
      where: { userId },
    });
    if (existingOwner) {
      return res.status(400).json({ message: "Owner already exists for this user" });
    }

    // Create owner and link to user
    const owner = await prisma.owner.create({
      data: { 
        name, 
        email, 
        phone, 
        gstNumber, 
        compneyname, 
        recipientName,
        houseNumber,
        streetName,
        locality,
        city,
        pinCode,
        state,
        userId 
      },
    });

    return res.json({ message: "Your data was successfully stored", owner });
  } catch (error) {
    console.error("Error creating owner:", error.message, error.stack);
    return res.status(500).json({ message: "Error creating owner", error: error.message });
  }
});


// Update owner data for authenticated user
router.put("/updateowner", async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      name, 
      email, 
      phone, 
      gstNumber, 
      compneyname, 
      recipientName,
      houseNumber,
      streetName,
      locality,
      city,
      pinCode,
      state
    } = req.body;

    if (!name || !email || !phone || !gstNumber || !compneyname) {
      return res.status(400).json({ message: "Name, email, phone, GST number, and company name are required" });
    }

    // Find owner by userId
    const existingOwner = await prisma.owner.findUnique({
      where: { userId },
    });

    if (!existingOwner) {
      return res.status(404).json({ message: "Owner not found for this user" });
    }

    // Update owner data
    const updatedOwner = await prisma.owner.update({
      where: { userId },
      data: { 
        name, 
        email, 
        phone, 
        gstNumber, 
        compneyname, 
        recipientName,
        houseNumber,
        streetName,
        locality,
        city,
        pinCode,
        state
      },
    });

    return res.json({ 
      message: "Owner details updated successfully", 
      owner: updatedOwner 
    });
  } catch (error) {
    console.error("Error updating owner:", error);
    return res.status(500).json({ 
      message: "Error updating owner details", 
      error: error.message 
    });
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
