import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url:   import.meta.env.VITE_KEYCLOAK_URL,
  realm: 'employee-training-plan',
  clientId: 'employee-training-plan-frontend-client',
});

export default keycloak;
