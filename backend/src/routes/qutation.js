import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma =  new PrismaClient();
const router = express.Router();
//http://localhost:5000/quation/data
router.post("/data",async(req,res)=>{
    const{number,ownerId,customerId,itemId} = req.body;
    try{
        if(!number || !ownerId || !customerId || !itemId){
            res.json({message:"you need entre all input fielsds"});

        }
        const quation = await prisma.quotation.create({
            data:{
                number,
                ownerId,
                customerId,
                itemId
            },include:{
                owner:true,
                customer:true,
                item:true }
        })
        console.log(quation);
       res.json(quation);

    }catch(err){
         console.log(err);
         res.status(500).json({message:`you errror occur on ${err.message}`})
    }
})


//http://localhost:5000/quation/getdata/102

router.get("/getdata/:number",async(req,res)=>{
    const{number} = req.params;
    try{
        const quationnumber = parseInt(req.params.number,10);
        if (isNaN(quationnumber)) {
            return res.status(400).json({ message: "Invalid quotation number" });
        }
      const finalresult  = await prisma.quotation.findUnique({
        where : {number:quationnumber},
        include:{
            owner:true,
            customer:true,
            item:true
        }   
      })
      if(!finalresult){
        return res.json({message:"No data found for this quotation number"})
      }
      console.log(finalresult)
      return res.status(200).json(finalresult)
    }catch(err){
        console.log(err)
        return res.json({message:`yourgetting data also faild ${err.message}`})
    }
})
export default router;