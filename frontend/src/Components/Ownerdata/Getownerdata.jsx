import React, { useEffect, useState } from "react";
import axios from "axios";
const BACKENDURL= import.meta.env.VITE_BACKEND_URL

export default function OwnerData() {
    const [owners, setOwners] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const res = await axios.get(`${BACKENDURL}/owners/allownerdata`);
                setOwners(res.data);
                console.log(res.data);
            } catch (err) {
                setError("Failed to fetch owners");
                console.error("Error fetching owners:", err);
            }
        };

        fetchOwners();
    }, []);

    return (
        <div>
            <h1>Owner Data</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {owners?.map((owner) => (
                    <li key={owner?.id}>{owner?.name} - {owner?.email}</li>
                ))}
            </ul>
        </div>
    );
}
