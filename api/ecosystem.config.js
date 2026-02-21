module.exports = {
    apps: [{
        name: 'zued-api',
        script: 'server.js',
        cwd: '/var/www/zued-api',
        env: {
            NODE_ENV: 'production',
            PORT: 3001
        },
        restart_delay: 3000,
        max_restarts: 10,
        watch: false,
    }]
};
