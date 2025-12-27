import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { theme } from "./theme/theme";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Facturas from "./pages/facturas";
import Operaciones from "./pages/operaciones";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/facturas" element={<ProtectedRoute><Facturas /></ProtectedRoute>} />
          <Route path="/operaciones" element={<ProtectedRoute><Operaciones /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
