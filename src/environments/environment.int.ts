export const environment = {
  production: false,
  apiUrl: 'https://dev-erp-europair.plexus.services/services/',
  powerAppUrl:
    'https://apps.powerapps.com/play/754e4380-9895-42fe-a608-01551e5bde67?tenantId=55f61621-dc4f-492f-86ec-62ffaace576e',
  mock: false,
  oAuthConfig: {
    issuer:
      'https://login.microsoftonline.com/55f61621-dc4f-492f-86ec-62ffaace576e/v2.0',
    redirectUri: window.location.origin + '/login',
    postLogoutRedirectUri: window.location.origin + '/login',
    clientId: '37bec995-6148-440d-855f-64396759b4aa',
    responseType: 'code',
    strictDiscoveryDocumentValidation: false,
    scope: 'openid api://37bec995-6148-440d-855f-64396759b4aa/app profile',
  },
};
