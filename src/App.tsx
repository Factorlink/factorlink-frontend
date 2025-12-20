import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { theme } from "./theme/theme";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Facturas from "./pages/facturas";
import Operaciones from "./pages/operaciones";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/facturas" element={<Facturas />} />
          <Route path="/operaciones" element={<Operaciones />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
