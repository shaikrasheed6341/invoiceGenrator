import express from 'express';
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client';
import { validate } from '../middleware/validation.js';
import { userRegistrationSchema } from '../validations/schemas.js';

const prisma = new PrismaClient();
const router = express.Router();

//http://localhost:5000/register/signup
router.post('/signup', validate(userRegistrationSchema), async(req,res)=>{
    const{firstname,lastname,email,password} = req.body;
    
    try{ 
         const hashedpassword  = await bcrypt.hash(password,10);
         console.log(hashedpassword);
         const userdata = await prisma.user.create({
             data:{
                firstname,
                lastname,
                email,
                password:hashedpassword
             }
          })
         console.log(userdata)
         return res.status(200).json({message:"you succes fully regesterd"})


   }catch(err){
     return res.status(404).json({message:`something went wrong ${err}`})
   }


})


export default router;
