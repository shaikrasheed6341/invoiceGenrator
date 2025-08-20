import axios from 'axios';

class PingService {
    constructor() {
        this.isRunning = false;
        this.interval = null;
        // Use external URL for pinging, not self-pinging
        this.serverUrl = process.env.RENDER_EXTERNAL_URL || process.env.FRONTEND_URL || 'http://localhost:5000';
    }

    start() {
        if (this.isRunning) {
            console.log('Ping service is already running');
            return;
        }

        console.log('🚀 Starting ping service to keep server alive...');
        console.log(`📡 Will ping external service to wake up: ${this.serverUrl}`);
        this.isRunning = true;

        // Ping every 4 minutes (240000 ms) to stay ahead of 5-minute timeout
        this.interval = setInterval(async () => {
            try {
                await this.pingServer();
            } catch (error) {
                console.error('Ping failed:', error.message);
            }
        }, 240000); // 4 minutes

        // Initial ping
        this.pingServer();
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
        console.log('⏹️ Ping service stopped');
    }

    async pingServer() {
        try {
            const pingUrl = `${this.serverUrl}/ping`;
            console.log(`🔄 Pinging server at: ${pingUrl} - ${new Date().toISOString()}`);
            
            const response = await axios.get(pingUrl, {
                timeout: 15000, // 15 second timeout
                headers: {
                    'User-Agent': 'PingService/1.0'
                }
            });

            if (response.status === 200) {
                console.log(`✅ Server responded successfully!`);
                console.log(`📊 Response: ${response.data.message}, Uptime: ${response.data.uptime}s`);
            } else {
                console.log(`⚠️ Server returned status: ${response.status}`);
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.log('💤 Server appears to be sleeping on Render free tier');
                console.log('🔄 Will retry in next cycle to wake it up');
            } else if (error.code === 'ETIMEDOUT') {
                console.log('⏰ Request timed out - server might be waking up');
            } else {
                console.error('❌ Ping error:', error.message);
            }
        }
    }

    // Method to manually trigger a ping
    async manualPing() {
        await this.pingServer();
    }
}

export default PingService;
