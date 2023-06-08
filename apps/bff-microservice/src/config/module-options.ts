import * as Joi from '@hapi/joi';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: './apps/bff-microservice/.env',
  load: [configuration],
  validationSchema: Joi.object({
    APP_ENV: Joi.string()
      .valid('development', 'production', 'test', 'local')
      .default('development'),
    APP_PORT: Joi.number().required(),
    AUTH0_BASE_URL: Joi.string().required(),
    USER_COMMON_MICROSERVICE_URL: Joi.string(),
    PRODUCT_COMMON_URL: Joi.string(),
    EMAIL_SENDER: Joi.string().required(),
  }),
};
