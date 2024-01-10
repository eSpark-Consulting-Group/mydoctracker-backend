module.exports = {
  apps: [
    {
      name: 'backend',
      instances: "max",
      exec_mode: "cluster",
      script: 'dist/src/main.js',
      args: 'start -p 3001',
      watch: true,
      env_production: {
        NODE_ENV: "production"
      },
      env_development: {
        NODE_ENV: "development"
      },
      env_qa: {
        NODE_ENV: "qa"
      }
    }
  ]
};