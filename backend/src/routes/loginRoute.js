// import express, { json } from 'express';
// import { PrismaClient } from '@prisma/client';
// import bcrypt from "bcrypt";






// import jwt from 'jsonwebtoken';
// const secretkey = "shaikraheed";

// const prisma = new PrismaClient();
// const router = express.Router();


// //http://localhost:5000/login/signin
// router.post('/signin', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         if (!email || !password) {
//             return res.status(404).json({ message: "your  need fill the inputs" })
//         }
//         const findemail = await prisma.user.findUnique({
//             where: {
//                 email
//             }
//         })
//         if (!findemail) {
//             return res.status(404).json({ message: "your email not found" })
//         }
//         const ismatch = await bcrypt.compare(password, findemail.password)
//         if (!ismatch) {
//             return res.json({ message: "password is a invalid" });
//         }

//         const token = jwt.sign({ id: findemail.id, email: findemail.email }, secretkey, { expiresIn: "7d" })

//         console.log(token);
//         return res.status(200).json({  token });





//     } catch (err) {
//         return res.json({ message: `somehting went wrong ${err}` })
//     }
// })

// export default router;