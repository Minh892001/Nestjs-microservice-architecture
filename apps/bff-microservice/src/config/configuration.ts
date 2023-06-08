export default (): any => ({
  // env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  microservice: {
    userCommon: process.env.USER_COMMON_MICROSERVICE_URL,
    productCommon: process.env.PRODUCT_COMMON_URL,
  },
  auth0: {
    baseUrl: process.env.AUTH0_BASE_URL,
  },
  email: {
    from: process.env.EMAIL_SENDER,
  },
});
