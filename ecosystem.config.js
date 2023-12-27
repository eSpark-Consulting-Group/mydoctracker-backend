module.exports = {
  apps: [
    {
      name: 'userbackend',
      instances: 'max',
      exec_mode: 'cluster',
      script: 'dist/main.js',
      args: 'start -p 3001',
      watch: true,
      env_local: {
        APP_ENV: 'local', // APP_ENV=local
      },
      env_development: {
        APP_ENV: 'dev', // APP_ENV=dev
      },
      env_production: {
        APP_ENV: 'prod', // APP_ENV=prod
      },
    },
  ],
};
