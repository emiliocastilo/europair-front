// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/',
  // apiUrl: "https://dev-erp-europair.plexus.services/services/",
  mock: false,
  oAuthConfig: {
    issuer:
      'https://login.microsoftonline.com/aa0ccb90-70ce-4fe7-bac0-c68c12be8ab1/v2.0',
    redirectUri: window.location.origin + '/login',
    postLogoutRedirectUri: window.location.origin + '/login',
    clientId: 'bfd88018-a688-4d7a-a72e-d08e159bee39',
    responseType: 'code',
    strictDiscoveryDocumentValidation: false,
    scope: 'openid api://bfd88018-a688-4d7a-a72e-d08e159bee39/app profile',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
