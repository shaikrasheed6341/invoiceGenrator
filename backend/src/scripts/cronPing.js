import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SERVER_URL = process.env.RENDER_EXTERNAL_URL || process.env.FRONTEND_URL || 'http://localhost:5000';
const PING_INTERVAL = 60000; // 1 minute in milliseconds

class CronPingService {
    constructor() {
        this.isRunning = false;
        this.interval = null;
        this.pingCount = 0;
        this.lastPingTime = null;
    }

    start() {
        if (this.isRunning) {
            console.log('Cron ping service is already running');
            return;
        }

        console.log(`🚀 Starting cron ping service to ping ${SERVER_URL} every minute...`);
        this.isRunning = true;
        this.lastPingTime = new Date();

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
        console.log('⏹️ Cron ping service stopped');
    }

    async pingServer() {
        try {
            this.pingCount++;
            const startTime = Date.now();
            
            console.log(`📡 Ping #${this.pingCount} - ${new Date().toISOString()}`);
            
            const response = await axios.get(`${SERVER_URL}/ping`, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'CronPingService/1.0'
                }
            });

            const responseTime = Date.now() - startTime;
            
            if (response.status === 200) {
                console.log(`✅ Ping successful! Response time: ${responseTime}ms`);
                console.log(`📊 Server uptime: ${response.data.uptime} seconds`);
                this.lastPingTime = new Date();
            } else {
                console.log(`⚠️ Unexpected status: ${response.status}`);
            }
        } catch (error) {
            console.error(`❌ Ping #${this.pingCount} failed:`, error.message);
            
            if (error.code === 'ECONNREFUSED') {
                console.log('💤 Server appears to be sleeping on Render free tier');
            } else if (error.code === 'ETIMEDOUT') {
                console.log('⏰ Request timed out');
            }
        }
    }

    getStats() {
        return {
            isRunning: this.isRunning,
            pingCount: this.pingCount,
            lastPingTime: this.lastPingTime,
            serverUrl: SERVER_URL,
            pingInterval: PING_INTERVAL
        };
    }
}

// If running directly, start the service
if (import.meta.url === `file://${process.argv[1]}`) {
    const cronPing = new CronPingService();
    cronPing.start();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Received SIGINT, shutting down gracefully...');
        cronPing.stop();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
        cronPing.stop();
        process.exit(0);
    });
}

export default CronPingService;
