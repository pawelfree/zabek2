// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  LOGIN_EXPIRES_IN: 3600, //sekundy
  MONGODB_URI: 'mongodb://localhost/zabek',
  JWT_PRIVATE_KEY: 'secret_jwt_key',
  RESET_TOKEN_EXPIRES_IN: 300, //sekundy
  ZABEK_SENDGRID_API_KEY: 'local',
  SALT: 10, //'ala_ma_kota@kot#to%ali&pies'

  MAX_PAGE_SIZE: 10,

  //mail templates config
  SYSTEM_NAME: "RTG Cloud",
  APP_SERVER: "https://rtgcloud.herokuapp.com",

  PASSWORD_RESET_PATH: "resetpassword/",
  PASSWORD_RESET_TEMPLATE_ID: "d-7d0e1ca1065841748b069ffff3cc5413",

  PASSWORD_RESET_ERROR_TEMPLATE_ID: "d-d7080425117d45fd97c088a8ab9a2321",
  DOCTOR_ACTIVATION_TEMPLATE_ID: "d-3255a5dfd4f04d869d8296011a8d8ee7",
  DOCTOR_ACCOUNT_CREATION_TEMPLATE_ID: "",
  EXAMINATION_CREATED_TEMPLATE_ID: "",
  COMMENT_ACKNOWLEDGEMENT_TEMPLATE_ID: "d-51179c8e9a484219af4e79830231a3a8",
};
