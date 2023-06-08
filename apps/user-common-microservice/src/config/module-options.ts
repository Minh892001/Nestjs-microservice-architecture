import * as Joi from '@hapi/joi';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: './apps/user-common-microservice/.env',
  load: [configuration],
  validationSchema: Joi.object({
    APP_ENV: Joi.string()
      .valid('development', 'production', 'test', 'local')
      .default('development'),
    APP_PORT: Joi.number().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().optional(),
    DB_NAME: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    SMTP_HOST: Joi.string().required(),
    SMTP_USERNAME: Joi.string().required(),
    SMTP_PASSWORD: Joi.string().required(),
    PAYPAL_BASE_URL: Joi.string().required(),
    PAYPAL_AUTH_TOKEN: Joi.string().required(),
    PAYPAL_RETURN_URL: Joi.string().required(),
    PAYPAL_CANCLE_URL: Joi.string(),
    AUTH0_SSA_CLIENT_ID: Joi.string().required(),
    AUTH0_SSA_CLIENT_SECRET: Joi.string().required(),
    S3_BUCKET: Joi.string().required(),
    S3_REGION: Joi.string().required(),
    S3_ACCESS_KEY: Joi.string().required(),
    S3_SECRET_ACCESS_KEY: Joi.string().required(),
    SMS_ACCOUNT_ID: Joi.string().required(),
    SMS_AUTH_TOKEN: Joi.string().required(),
  }),
};
