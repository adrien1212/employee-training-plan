import { Outlet } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

const Loader = () => (
  <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
);

const PrivateRoutes = () => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!keycloak.authenticated) {
    keycloak.login();
    return null;
  }

  return <Outlet />;
};

export default PrivateRoutes;
