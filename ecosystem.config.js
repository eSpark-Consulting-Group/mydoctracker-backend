module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'dist/main.js',
      instances: "max",
      exec_mode: "cluster",
      script: 'dist/main.js',
      args: 'start -p 3001',
      watch: true,
      env: {
        PORT: process.env.PORT,
        MYSQL_HOST: process.env.MYSQL_HOST,
        MYSQL_USER: process.env.MYSQL_USER,
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
        MYSQL_DATABASE: process.env.MYSQL_DATABASE,
        MYSQL_PORT: process.env.MYSQL_PORT,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRE: process.env.JWT_EXPIRE,
        API_KEY: process.env.API_KEY,
      },
    }
  ]
};
