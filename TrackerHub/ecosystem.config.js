module.exports = {
  apps: [
    {
      name: 'Tracker Hub',
      script: 'dist/index.js',
      watch: true,
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
};
