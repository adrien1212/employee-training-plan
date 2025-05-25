import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: `http://localhost:7980`,
  realm: 'employee-training-plan',
  clientId: 'employee-training-plan-frontend-client',
});

export default keycloak;
