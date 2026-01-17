import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { theme } from "./theme/theme";
import Login from "./pages/login";
import EmpresasRegister from "./pages/register/empresa";
import FactoringRegister from "./pages/register/factoring";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";
import Dashboard from "./pages/dashboard";
import Facturas from "./pages/facturas";
import Operaciones from "./pages/operaciones";
import Edit from "./pages/edit";
import UsuarioTab from "./pages/edit/usuario";
import EmpresaTab from "./pages/edit/empresa";
import FactoringTab from "./pages/edit/factoring";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleSelection from "./pages/role/selection";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<EmpresasRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<EmpresasRegister />} />
          <Route path="/empresas/register" element={<EmpresasRegister />} />
          <Route path="/factoring/register" element={<FactoringRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facturas"
            element={
              <ProtectedRoute>
                <Facturas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operaciones"
            element={
              <ProtectedRoute>
                <Operaciones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/role-selection"
            element={
              <ProtectedRoute>
                <RoleSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit"
            element={
              <ProtectedRoute>
                <Edit />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/edit/usuario" replace />} />
            <Route path="usuario" element={<UsuarioTab />} />
            <Route path="empresa" element={<EmpresaTab />} />
            <Route path="factoring" element={<FactoringTab />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
