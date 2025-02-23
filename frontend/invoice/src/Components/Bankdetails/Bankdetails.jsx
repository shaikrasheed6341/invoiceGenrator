import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify CSS

function Bankdetails() {
    const [name, setName] = useState("");
    const [ifsccode, setIfsccode] = useState("");
    const [accountno, setAccountno] = useState("");
    const [bank, setBank] = useState("");
    const[upid,setUpid]=useState("");

    const handleform = async (e) => {
        e.preventDefault();
        const formdata = { name, ifsccode, accountno, bank,upid };

        try {
            const result = await axios.post("http://localhost:5000/bank/bankdetails", formdata);
            toast.success(result.data.message || "Success!", { transition: Bounce }); // ✅ Ensure API returns `message`
        } catch (err) {
            console.error("Error:", err);
            toast.error(err.response?.data?.message || "Something went wrong!", { transition: Bounce }); // ✅ Better error handling
        }
    };

    return (
        <div>
            <ToastContainer /> {/* ✅ Ensure ToastContainer is present */}
            <form onSubmit={handleform}>
                <input className="border-2 m-2 p-2" placeholder="Enter your name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                <input className="border-2 m-2 p-2" placeholder="Enter your IFSC code" type="text" value={ifsccode} onChange={(e) => setIfsccode(e.target.value)} required />
                <input className="border-2 m-2 p-2" placeholder="Enter your account number" type="text" value={accountno} onChange={(e) => setAccountno(e.target.value)} required />
                <input className="border-2 m-2 p-2" placeholder="Enter your bank name" type="text" value={bank} onChange={(e) => setBank(e.target.value)} required />
                <input className="border-2 m-2 p-2" placeholder="Enter your upid" type="text" value={upid} onChange={(e) => setUpid(e.target.value)} required />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>

            </form>
        </div>
    );
}

export default Bankdetails;
