module.exports = {
  apps: [{
    name: 'invoice-generator-backend',
    script: 'index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Production optimizations
    max_memory_restart: '400M',
    node_args: '--max-old-space-size=400',
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Monitoring
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    // Health checks
    health_check_grace_period: 3000,
    // Restart policy
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000
  }]
};
