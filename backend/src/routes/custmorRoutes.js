import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.post("/",async(req,res)=>{
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

router.get('/getallcustomersdata',async(req,res)=>{
   try{
       const custmor =  await prisma.customer.findMany();
       if(!custmor){
        res.json({message:"custmor is not found"})
       }
       res.json(custmor);
   }catch(err){
      console.log(err);
      res.json({message:"something went wrong with geting custmor data",custmor});
   }
})



export default router;