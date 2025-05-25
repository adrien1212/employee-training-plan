// src/components/PrivateRoute.tsx
import { Spinner, Center } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

const PrivateRoutes = () => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!keycloak.authenticated) {
    keycloak.login();
    return null;
  }

  return <Outlet />;
};


export default PrivateRoutes;