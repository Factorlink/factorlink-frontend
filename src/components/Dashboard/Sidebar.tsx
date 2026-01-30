import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  IconButton,
} from "@mui/material";
import { Logout, Menu } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/png/factorlink-logo.png";
import { getMenuItemsByRole, mainMenuItems } from "../../config/menuConfig";
import useAuthStore from "../../store/authStore";

const bottomItems = [{ text: "Logout", icon: Logout, path: "/login" }];

const Sidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const { currentRole } = useAuthStore();

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <Box
      sx={{
        width: sidebarWidth,
        minHeight: "100vh",
        backgroundColor: "background.paper",
        borderRight: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease-in-out",
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
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        {!collapsed && (
          <img src={logo} alt="factorlink-logo" style={{ maxWidth: 150 }} />
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{ ml: collapsed ? 0 : "auto", color: "text.secondary" }}
          size="small"
        >
          <Menu />
        </IconButton>
      </Box>


      {/* Main Menu */}
      {
        <List sx={{ px: 1, flex: 1 }}>
          {currentRole?.contexto &&
            getMenuItemsByRole(mainMenuItems, currentRole.role).map((item) => (
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
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 1 : 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 40,
                      justifyContent: "center",
                    }}
                  >
                    <item.icon
                      sx={{
                        color: isActive(item.path)
                          ? "primary.main"
                          : "text.secondary",
                      }}
                    />
                  </ListItemIcon>
                  {!collapsed && (
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
                  )}
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      }

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
                justifyContent: collapsed ? "center" : "flex-start",
                px: collapsed ? 1 : 2,
              }}
            >
              <ListItemIcon
                sx={{ minWidth: collapsed ? 0 : 40, justifyContent: "center" }}
              >
                <item.icon sx={{ color: "primary.main" }} />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiTypography-root": {
                      color: "primary.main",
                      fontSize: "0.95rem",
                    },
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
