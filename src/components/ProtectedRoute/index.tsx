import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import SiiSyncPromptModal from "../Modals/SiiSyncPromptModal";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {children}
      <SiiSyncPromptModal />
    </>
  );
};

export default ProtectedRoute;
