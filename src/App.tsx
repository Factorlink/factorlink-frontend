import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { theme, AppThemeProvider } from "./theme";
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
import UsuariosTab from "./pages/edit/usuarios";
import DocumentosLegalesTab from "./pages/edit/documentos-legales";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleSelection from "./pages/role/selection";
import Invitations from "./pages/invitations";
import TerminosCondiciones from "./pages/legal/terminos-condiciones";
import PoliticaPrivacidad from "./pages/legal/politica-privacidad";
import ConsentimientoEmails from "./pages/legal/consentimiento-emails";
import FacturaDetail from "./pages/facturas/detail";
import CotizarFactura from "./pages/facturas/cotizar";
import Marketplace from "./pages/marketplace";
import FacturaFactoringDetail from "./pages/facturas/detail/factoring";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppThemeProvider>
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
          <Route
            path="/terminos-condiciones"
            element={<TerminosCondiciones />}
          />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route
            path="/consentimiento-emails"
            element={<ConsentimientoEmails />}
          />

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
            path="/facturas/marketplace"
            element={
              <ProtectedRoute>
                <Facturas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facturas/ofertas"
            element={
              <ProtectedRoute>
                <Facturas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facturas/cedidas"
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
            path="/invitations"
            element={
              <ProtectedRoute>
                <Invitations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facturas/:id"
            element={
              <ProtectedRoute>
                <FacturaDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facturas/:id/cotizar"
            element={
              <ProtectedRoute>
                <CotizarFactura />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facturas/:id/factoring"
            element={
              <ProtectedRoute>
                <FacturaFactoringDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace/ofertas"
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace/cedidas"
            element={
              <ProtectedRoute>
                <Marketplace />
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
            <Route path="usuarios" element={<UsuariosTab />} />
            <Route
              path="documentos-legales"
              element={<DocumentosLegalesTab />}
            />
          </Route>
        </Routes>
        </BrowserRouter>
      </AppThemeProvider>
    </ThemeProvider>
  );
}

export default App;
