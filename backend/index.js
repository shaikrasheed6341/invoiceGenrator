import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import ownerRoutes from "./src/routes/ownerRoutes.js";
import custmorRoutes from "./src/routes/custmorRoutes.js";
import itemsRoutes from "./src/routes/itemsRoutes.js"
import qutation from "./src/routes/qutation.js"
import bankdetails from "./src/routes/bankdetails.js"
// import registerRoute from "./src/routes/registerRoute.js";
// import loginRoute from "./src/routes/loginRoute.js"
// import authmiddle from "./src/routes/authmiddleware.js";



const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// app.use("/register",registerRoute);
// app.use("/login",loginRoute)
app.use("/quation",qutation);
app.use("/custmor",custmorRoutes);
app.use("/owners", ownerRoutes);
app.use("/iteam",itemsRoutes);
app.use("/bank",bankdetails);





app.listen(5000, () => console.log("🚀 Server running on port 5000"));
