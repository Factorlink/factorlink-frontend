import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import type { Role } from "../../types/role";
import SiiSyncPromptModal from "../Modals/SiiSyncPromptModal";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ENROLLMENT_ALLOWLIST = ["/role-selection", "/edit/empresa"];

const needsEmpresaEnrollment = (currentRole: Role | null) =>
  Boolean(
    currentRole &&
      currentRole.contexto === "empresa" &&
      (!currentRole.empresaId ||
        currentRole.empresa?.estadoEnrolamiento === "PENDIENTE"),
  );

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { accessToken, currentRole } = useAuthStore();
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (!currentRole && location.pathname !== "/role-selection") {
    return <Navigate to="/role-selection" replace />;
  }

  const isAllowlisted = ENROLLMENT_ALLOWLIST.some(
    (path) =>
      location.pathname === path || location.pathname.startsWith(`${path}/`),
  );

  if (needsEmpresaEnrollment(currentRole) && !isAllowlisted) {
    return <Navigate to="/role-selection" replace />;
  }

  return (
    <>
      {children}
      <SiiSyncPromptModal />
    </>
  );
};

export default ProtectedRoute;
