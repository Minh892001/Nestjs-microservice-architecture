export default (): any => ({
  // env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  auth0: {
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    ssaClientId: process.env.AUTH0_SSA_CLIENT_ID,
    ssaClientSecret: process.env.AUTH0_SSA_CLIENT_SECRET,
    connectionName: process.env.AUTH0_CONNECTION_NAME,
    connectionId: process.env.AUTH0_CONNECTION_ID,
    baseUrl: process.env.AUTH0_BASE_URL,
  },
  email: {
    smtpHost: process.env.SMTP_HOST,
    smtpUsername: process.env.SMTP_USERNAME,
    smtpPassword: process.env.SMTP_PASSWORD,
  },
  paypal: {
    baseUrl: process.env.PAYPAL_BASE_URL,
    authToken: process.env.PAYPAL_AUTH_TOKEN,
    returnUrl: process.env.PAYPAL_RETURN_URL,
    cancelUrl: process.env.PAYPAL_CANCEL_URL,
  },
  s3: {
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET,
    accessKey: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  sms: {
    accountId: process.env.SMS_ACCOUNT_ID,
    authToken: process.env.SMS_AUTH_TOKEN,
  },
});
