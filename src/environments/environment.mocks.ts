export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/',
  mock: true,
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
