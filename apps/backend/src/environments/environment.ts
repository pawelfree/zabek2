// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  LOGIN_EXPIRES_IN: 600, //sekundy
  MONGODB_URI: 'mongodb://localhost/zabek',
  JWT_PRIVATE_KEY: 'secret_jwt_key',
  RESET_TOKEN_EXPIRES_IN: 300, //sekundy
  ZABEK_SENDGRID_API_KEY: 'local',
  SALT: 10 //'ala_ma_kota@kot#to%ali&pies'
};
