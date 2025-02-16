import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import ownerRoutes from "./src/routes/ownerRoutes.js";
import custmorRoutes from "./src/routes/custmorRoutes.js";
import itemsRoutes from "./src/routes/itemsRoutes.js"
import qutation from "./src/routes/qutation.js"

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());


app.use("/quation",qutation)
app.use("/custmor",custmorRoutes);
app.use("/owners", ownerRoutes);
app.use("/iteam",itemsRoutes);


app.listen(5000, () => console.log("🚀 Server running on port 5000"));
