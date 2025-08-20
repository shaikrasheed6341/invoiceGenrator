import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const RENDER_URL = process.env.RENDER_EXTERNAL_URL || 'https://your-app-name.onrender.com';
const PING_INTERVAL = 4 * 60 * 1000; // 4 minutes in milliseconds

class RenderWakeUpService {
    constructor() {
        this.isRunning = false;
        this.interval = null;
        this.pingCount = 0;
        this.lastSuccessTime = null;
        this.lastErrorTime = null;
    }

    start() {
        if (this.isRunning) {
            console.log('🚫 Wake-up service is already running');
            return;
        }

        console.log('🚀 Starting Render Wake-Up Service...');
        console.log(`📡 Target URL: ${RENDER_URL}`);
        console.log(`⏰ Ping interval: ${PING_INTERVAL / 1000} seconds`);
        console.log('💡 This service will ping your Render server every 4 minutes to keep it awake');
        
        this.isRunning = true;
        this.startTime = new Date();

        // Ping every 4 minutes
        this.interval = setInterval(async () => {
            await this.pingServer();
        }, PING_INTERVAL);

        // Initial ping
        this.pingServer();
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
        console.log('⏹️ Wake-up service stopped');
    }

    async pingServer() {
        this.pingCount++;
        const currentTime = new Date();
        
        try {
            console.log(`\n📡 Ping #${this.pingCount} - ${currentTime.toLocaleTimeString()}`);
            console.log(`🔄 Pinging: ${RENDER_URL}/ping`);
            
            const startTime = Date.now();
            const response = await axios.get(`${RENDER_URL}/ping`, {
                timeout: 20000, // 20 second timeout
                headers: {
                    'User-Agent': 'RenderWakeUpService/1.0'
                }
            });

            const responseTime = Date.now() - startTime;
            
            if (response.status === 200) {
                this.lastSuccessTime = currentTime;
                console.log(`✅ SUCCESS! Server is awake and responding`);
                console.log(`⚡ Response time: ${responseTime}ms`);
                console.log(`📊 Server uptime: ${response.data.uptime} seconds`);
                console.log(`🕐 Last successful ping: ${currentTime.toLocaleString()}`);
            } else {
                console.log(`⚠️ Unexpected status: ${response.status}`);
            }
        } catch (error) {
            this.lastErrorTime = currentTime;
            
            if (error.code === 'ECONNREFUSED') {
                console.log(`💤 Server is sleeping (Connection refused)`);
                console.log(`🔄 Will retry in ${PING_INTERVAL / 1000} seconds to wake it up`);
            } else if (error.code === 'ETIMEDOUT') {
                console.log(`⏰ Request timed out - server might be waking up`);
            } else if (error.response) {
                console.log(`❌ Server error: ${error.response.status} - ${error.response.statusText}`);
            } else {
                console.log(`❌ Network error: ${error.message}`);
            }
            
            console.log(`🕐 Last error: ${currentTime.toLocaleString()}`);
        }
    }

    getStats() {
        const uptime = this.startTime ? Date.now() - this.startTime.getTime() : 0;
        return {
            isRunning: this.isRunning,
            pingCount: this.pingCount,
            uptime: Math.floor(uptime / 1000),
            lastSuccessTime: this.lastSuccessTime,
            lastErrorTime: this.lastErrorTime,
            targetUrl: RENDER_URL,
            pingInterval: PING_INTERVAL / 1000
        };
    }

    showStats() {
        const stats = this.getStats();
        console.log('\n📊 SERVICE STATISTICS:');
        console.log(`Status: ${stats.isRunning ? '🟢 Running' : '🔴 Stopped'}`);
        console.log(`Total pings: ${stats.pingCount}`);
        console.log(`Service uptime: ${stats.uptime} seconds`);
        console.log(`Target URL: ${stats.targetUrl}`);
        console.log(`Ping interval: ${stats.pingInterval} seconds`);
        
        if (stats.lastSuccessTime) {
            console.log(`Last success: ${stats.lastSuccessTime.toLocaleString()}`);
        }
        if (stats.lastErrorTime) {
            console.log(`Last error: ${stats.lastErrorTime.toLocaleString()}`);
        }
    }
}

// If running directly, start the service
if (import.meta.url === `file://${process.argv[1]}`) {
    const wakeUpService = new RenderWakeUpService();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Received SIGINT, shutting down gracefully...');
        wakeUpService.showStats();
        wakeUpService.stop();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
        wakeUpService.showStats();
        wakeUpService.stop();
        process.exit(0);
    });

    // Show stats every 10 minutes
    setInterval(() => {
        wakeUpService.showStats();
    }, 10 * 60 * 1000);

    // Start the service
    wakeUpService.start();
}

export default RenderWakeUpService;
