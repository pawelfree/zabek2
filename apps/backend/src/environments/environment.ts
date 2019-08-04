// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  loginExpiresIn: 300,
  MONGODB_URI: 'mongodb://localhost/zabek',
  JWT_PRIVATE_KEY: 'secret_jwt_key'
};
