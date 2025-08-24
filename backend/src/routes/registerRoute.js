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
    
    console.log('📝 Registration attempt for:', email);
    
    try{ 
         const hashedpassword  = await bcrypt.hash(password,10);
         console.log('🔐 Password hashed successfully');
         
         const userdata = await prisma.user.create({
             data:{
                firstname,
                lastname,
                email,
                password:hashedpassword
             }
          })
         
         console.log('✅ User created successfully:', userdata.id);
         return res.status(200).json({
           message: "Successfully registered!",
           user: {
             id: userdata.id,
             firstname: userdata.firstname,
             lastname: userdata.lastname,
             email: userdata.email
           }
         })


   }catch(err){
     console.error('Registration error:', err);
     
     // Handle duplicate email error
     if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
       return res.status(409).json({message: "Email already exists. Please use a different email or login."});
     }
     
     return res.status(500).json({message: "Registration failed. Please try again."});
   }


})


export default router;
