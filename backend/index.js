import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import ownerRoutes from "./src/routes/ownerRoutes.js";
import custmorRoutes from "./src/routes/custmorRoutes.js";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.use("/custmor",custmorRoutes);
app.use("/owners", ownerRoutes);


app.listen(5000, () => console.log("🚀 Server running on port 5000"));
