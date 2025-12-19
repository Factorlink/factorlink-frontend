import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  Typography,
  useTheme,
} from "@mui/material";
import {
  GridView,
  Description,
  SwapHoriz,
  Assessment,
  Settings,
  Logout,
  Search,
  Menu,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { text: "Inicio / Dashboard", icon: GridView, path: "/dashboard" },
  { text: "Control de Facturas", icon: Description, path: "/facturas" },
  { text: "Operaciones", icon: SwapHoriz, path: "/operaciones" },
  { text: "Riesgo / Scoring", icon: Assessment, path: "/riesgo" },
];

const bottomItems = [
  { text: "Configuración", icon: Settings, path: "/configuracion" },
  { text: "Logout", icon: Logout, path: "/login" },
];

const Sidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      sx={{
        width: 260,
        minHeight: "100vh",
        backgroundColor: "background.paper",
        borderRight: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 2,
          pb: 3,
        }}
      >
        <Box sx={{ position: "relative", width: 32, height: 32 }}>
          <Box
            sx={{
              position: "absolute",
              width: 20,
              height: 20,
              border: `2px solid ${theme.palette.primary.main}`,
              transform: "rotate(45deg)",
              top: 0,
              left: 6,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 20,
              height: 20,
              border: `2px solid ${theme.palette.primary.main}`,
              transform: "rotate(45deg)",
              top: 8,
              left: 6,
            }}
          />
        </Box>
        <Typography
          sx={{
            fontWeight: 300,
            fontSize: "1.4rem",
            letterSpacing: "-0.5px",
          }}
        >
          <span style={{ color: theme.palette.primary.main }}>factor</span>
          <span style={{ fontWeight: 500, color: theme.palette.text.secondary }}>
            link
          </span>
        </Typography>
        <Menu sx={{ ml: "auto", color: "text.secondary" }} />
      </Box>

      {/* Search */}
      <Box sx={{ px: 2, pb: 2 }}>
        <TextField
          size="small"
          placeholder="Buscar"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search sx={{ color: "primary.main" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "background.default",
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* Main Menu */}
      <List sx={{ px: 1, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                backgroundColor: isActive(item.path)
                  ? "rgba(0, 188, 212, 0.08)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(0, 188, 212, 0.12)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <item.icon
                  sx={{
                    color: isActive(item.path)
                      ? "primary.main"
                      : "text.secondary",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: isActive(item.path) ? 600 : 400,
                    color: isActive(item.path)
                      ? "text.primary"
                      : "text.secondary",
                    fontSize: "0.95rem",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Bottom Menu */}
      <List sx={{ px: 1, pb: 2 }}>
        {bottomItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "rgba(0, 188, 212, 0.12)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <item.icon sx={{ color: "primary.main" }} />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiTypography-root": {
                    color: "primary.main",
                    fontSize: "0.95rem",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
