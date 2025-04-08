import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerData() {
    const [owners, setOwners] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const res = await axios.get("http://localhost:5000/owners/allownerdata");
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
