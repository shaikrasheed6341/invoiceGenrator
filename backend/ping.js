// ping.js
import fetch from "node-fetch";

const url = "https://your-app.onrender.com"; // Replace with your Render app URL

setInterval(async () => {
  try {
    const res = await fetch(url);
    console.log(`[${new Date().toISOString()}] Pinged: ${res.status}`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Ping failed:`, err.message);
  }
}, 10000); // every 10 seconds
