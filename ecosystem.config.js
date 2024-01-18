module.exports = {
  apps: [
    {
      name: 'backend',
      instances: "max",
      exec_mode: "cluster",
      script: 'dist/src/main.js',
      watch: true,
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
        BUCKET_ID:process.env.BUCKET_ID,
        SENDGRID_SENDER_EMAIL:process.env.SENDGRID_SENDER_EMAIL,
        SENDGRID_API_KEY:process.env.SENDGRID_API_KEY,
        SENDGRID_FORGOT_PASSWORD_TEMPLATE_ID:process.env. SENDGRID_FORGOT_PASSWORD_TEMPLATE_ID,
        B2_APPLICATION_KEY_ID:process.env. B2_APPLICATION_KEY_ID,
        B2_APPLICATION_KEY:process.env. B2_APPLICATION_KEY,
      }
    }
  ]
};
// module.exports = {
//   apps: [
//     {
//       name: 'backend',
//       instances: "max",
//       exec_mode: "cluster",
//       script: 'dist/src/main.js',
//       args: 'start -p 3001',
//       watch: true,
//       env: {
//         PORT: process.env.PORT,
//         MYSQL_HOST: process.env.MYSQL_HOST,
//         MYSQL_USER: process.env.MYSQL_USER,
//         MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
//         MYSQL_DATABASE: process.env.MYSQL_DATABASE,
//         MYSQL_PORT: process.env.MYSQL_PORT,
//         JWT_SECRET: process.env.JWT_SECRET,
//         JWT_EXPIRE: process.env.JWT_EXPIRE,
//         API_KEY: process.env.API_KEY,
//       },
//     }
//   ]
// };
