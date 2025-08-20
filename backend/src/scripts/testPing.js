import PingService from '../services/pingService.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 Testing Ping Service...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('PORT:', process.env.PORT || 5000);
console.log('RENDER_EXTERNAL_URL:', process.env.RENDER_EXTERNAL_URL || 'Not set');

const pingService = new PingService();

// Test manual ping
console.log('\n📡 Testing manual ping...');
try {
    await pingService.manualPing();
} catch (error) {
    console.error('Manual ping failed:', error.message);
}

// Test service start
console.log('\n🚀 Testing service start...');
pingService.start();

// Wait 5 seconds then stop
setTimeout(() => {
    console.log('\n⏹️ Stopping service after 5 seconds...');
    pingService.stop();
    console.log('✅ Test completed!');
    process.exit(0);
}, 5000);
