export default (): any => ({
  // env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  }
});
