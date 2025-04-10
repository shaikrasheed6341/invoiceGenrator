import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

//http://localhost:5000/custmor/345678456
router.put('/:phone', async (req, res) => {
    const { phone } = req.params;
    const { name, address,gstnumber,pannumber } = req.body;
    try {
        const existcustmer = await prisma.customer.findUnique({
            where: { phone }
        })
        if (!existcustmer) {
            return   res.status(500).json({ message: "this custmer not exist" });
        }
        const updatecustmer = await prisma.customer.update({
            where: { phone },
            data: { name, address,gstnumber,pannumber}
        })
        console.log(updatecustmer)
        return res.json({ message: `sucesssfully updated custmer `,updatecustmer })



    } catch (err) {
        console.log(err);
        if (err.message) {
            return  res.status(500).json({ message: "custmer updatetion is went wrong" })
        }else{
            return  res.json(err)
        }
    }
})



//http://localhost:5000/custmor/custmor
router.post("/custmor", async (req, res) => {
    try {
        const { name, address, phone ,gstnumber,pannumber} = req.body;

        if (!name || !address || !phone  || !gstnumber ||!pannumber) {
            return res.json({ message: "you need fill the all inputs " });

        }

        const customer = await prisma.customer.create({
            data: {
                name,
                address,
                phone,
                gstnumber,
                pannumber
            }
        })
        console.log(customer);
        return  res.json({ message: "Custmor Data store sucessfully" });


    } catch (err) {
        console.error("Error creating customer:", err.message, err.stack);
       return  res.status(500).json({ message: "something went wrong while uploading", err })
    }
})


//http://localhost:5000/custmor/475879
router.get("/:phone", async (req, res) => {
    const { phone } = req.params;
    try {
        const customer = await prisma.customer.findUnique({
            where: { phone: String(phone) }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer is not found" });
        }

       return res.status(200).json(customer);

    } catch (err) {
        console.error("Error fetching customer:", err);
        return res.status(500).json({ message: `An error occurred: ${err.message}`, err });
    }
});


//http://localhost:5000/custmor/
router.get("/", async (req, res) => {
    try {
        const custmor = await prisma.customer.findMany();
        return   res.json(custmor);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}

)




export default router;