import express  from "express";
import { Prisma, PrismaClient } from "@prisma/client";
const  prisma = new PrismaClient();
const router = express.Router();
//http://localhost:5000/bank/bankdetails
router.post("/bankdetails",async(req,res)=>{
    const{name,ifsccode, accountno,bank,upid,upidname} =req.body;
    try{
        if(!name || !ifsccode || !accountno || !bank|| !upid || !upidname){
            return res.json({message:"fill the all input fields"})
        }
        const result  = await prisma.bankDetails.create({
            data:{
                name,
                ifsccode,
                accountno,
                bank,
                upid,
                upidname
            }
        })
        console.log(result)
        return res.json(result)

    }catch(err){
        console.log(err);
        return res.status(400).json({message:"error with bank server",err})
    }

})



export default router;