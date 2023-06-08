export const REQUEST_ID_TOKEN_HEADER = 'x-request-id';

export const FORWARDED_FOR_TOKEN_HEADER = 'x-forwarded-for';

export const PERMISSION_TOKEN_KEY = 'x-lc-permission-token';

export const PERMISSION_KEY = 'permissios';

export const EXPIRED_TIME = 60 * 60;

export enum USER_TYPE {
  SYSTEM_ADMIN = 'sysadmin',
  GENERAL = 'general',
}

export enum PAYPAL_METHOD {
  PAYPAL = 'paypal',
}

export enum ACL_REGIME {
  PUBLIC_READ = 'public-read',
}

export enum USER_ROLE {
  CREATE_USER = 'create:user',
  READ_USER = 'read:user',
  DELETE_USER = 'delete:user',
  ALL_USER = 'all:user',
  READ_ROLE = 'read:role',
  WRITE_ROLE = 'write:role',
  DELETE_ROLE = 'delete:role',
  ALL_ROLE = 'all:role',
}
