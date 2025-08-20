import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SERVER_URL = process.env.RENDER_EXTERNAL_URL || process.env.FRONTEND_URL || 'http://localhost:5000';

async function pingServer() {
    try {
        console.log(`Pinging server at: ${SERVER_URL}/ping`);
        
        const response = await axios.get(`${SERVER_URL}/ping`, {
            timeout: 10000,
            headers: {
                'User-Agent': 'ExternalPingScript/1.0'
            }
        });

        if (response.status === 200) {
            console.log(`✅ Server pinged successfully at ${new Date().toISOString()}`);
            console.log(`Response: ${response.data.message}`);
            console.log(`Uptime: ${response.data.uptime} seconds`);
        } else {
            console.log(`⚠️ Server returned status: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Ping failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('Server is not accessible. It may be sleeping on Render free tier.');
        }
    }
}

// Run ping
pingServer();
