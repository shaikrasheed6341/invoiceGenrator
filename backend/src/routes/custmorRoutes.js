import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();
//http://localhost:5000/custmor/custmor
router.post("/custmor",async(req,res)=>{
    try{
    const{name,address,phone} = req.body;
    
        if(!name || !address || !phone){
              res.json({message:"you need fill the all inputs "});

        }

        const customer = await prisma.customer.create({
            data:{
                name,
                address,
                phone
            }
        })
        console.log(customer);
        res.json(customer);


    }catch(err){
        console.log("eroor occures in coustomer routes",err);
        res.status(500).json({message:"something went wrong while uploading",err})
    }
})


//http://localhost:5000/custmor/475879
router.get("/:phone", async (req, res) => {
    const { phone } = req.params;
    try {
        const customer = await prisma.customer.findUnique({
            where: {phone:String(phone) }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer is not found" });
        }

        res.status(200).json(customer);

    } catch (err) {
        console.error("Error fetching customer:", err);
        res.status(500).json({ message: `An error occurred: ${err.message}`,  err });
    }
});


//http://localhost:5000/custmor/
router.get("/", async(req, res) => {
    try {
      const custmor = await prisma.customer.findMany();
      res.json(custmor);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }

)




export default router;