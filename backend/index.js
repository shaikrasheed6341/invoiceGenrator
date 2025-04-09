import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import ownerRoutes from "./src/routes/ownerRoutes.js";
import customerRoutes from "./src/routes/custmorRoutes.js";
import itemsRoutes from "./src/routes/itemsRoutes.js";
import quotationRoutes from "./src/routes/qutation.js";
import bankDetailsRoutes from "./src/routes/bankdetails.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,

}));

app.use("/quotation", quotationRoutes);
app.use("/customer", customerRoutes);
app.use("/owners", ownerRoutes);
app.use("/items", itemsRoutes);
app.use("/bank", bankDetailsRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;
