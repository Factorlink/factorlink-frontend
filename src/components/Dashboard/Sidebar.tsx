import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Logout, Menu } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/png/factorlink-logo.png";
import { getMenuItemsByRole, mainMenuItems } from "../../config/menuConfig";
import useAuthStore from "../../store/authStore";

const bottomItems = [{ text: "Logout", icon: Logout, path: "/login" }];

const Sidebar = () => {
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
        backgroundColor: "var(--color-bg-default-primary)",
        borderRight: "1px solid var(--color-border-default-primary)",
        display: "flex",
        flexDirection: "column",
        transition: "width var(--duration-fast) var(--easing-ease)",
      }}
    >
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
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          <Menu />
        </IconButton>
      </Box>

      <List sx={{ px: 1, flex: 1 }}>
        {currentRole?.contexto &&
          getMenuItemsByRole(mainMenuItems, currentRole.role).map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: "var(--radius-m)",
                    backgroundColor: active
                      ? "var(--color-bg-accent-tertiary)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: active
                        ? "var(--color-bg-accent-tertiary-hover)"
                        : "var(--color-bg-default-primary-hover)",
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
                        color: active
                          ? "var(--color-fg-accent-primary)"
                          : "text.secondary",
                      }}
                    />
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      sx={{
                        "& .MuiTypography-root": {
                          fontFamily: "var(--font-heading)",
                          fontWeight: active ? 500 : 400,
                          color: active
                            ? "var(--color-fg-accent-primary)"
                            : "text.secondary",
                          fontSize: "var(--font-size-s)",
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>

      <List sx={{ px: 1, pb: 2 }}>
        {bottomItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: "var(--radius-m)",
                "&:hover": {
                  backgroundColor: "var(--color-bg-danger-tertiary)",
                },
                justifyContent: collapsed ? "center" : "flex-start",
                px: collapsed ? 1 : 2,
              }}
            >
              <ListItemIcon
                sx={{ minWidth: collapsed ? 0 : 40, justifyContent: "center" }}
              >
                <item.icon sx={{ color: "var(--color-fg-danger-primary)" }} />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiTypography-root": {
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-fg-danger-primary)",
                      fontSize: "var(--font-size-s)",
                      fontWeight: 500,
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
