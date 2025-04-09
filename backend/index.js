import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import ownerRoutes from "./src/routes/ownerRoutes.js";
import custmorRoutes from "./src/routes/custmorRoutes.js";
import itemsRoutes from "./src/routes/itemsRoutes.js";
import qutation from "./src/routes/qutation.js";
import bankdetails from "./src/routes/bankdetails.js";
// import registerRoute from "./src/routes/registerRoute.js";
// import loginRoute from "./src/routes/loginRoute.js";
// import authmiddle from "./src/routes/authmiddleware.js";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({
    origin: "https://invoice-genrator-tvpk-git-main-shaikrasheeds-projects.vercel.app", // New frontend URL
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200, // Handle preflight
}));

// Manual header fallback
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://invoice-genrator-tvpk-git-main-shaikrasheeds-projects.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use("/quation", qutation);
app.use("/custmor", custmorRoutes);
app.use("/owners", ownerRoutes);
app.use("/iteam", itemsRoutes);
app.use("/bank", bankdetails);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
export default app;