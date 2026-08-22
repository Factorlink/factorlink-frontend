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
import { Menu } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/png/factorlink-logo.png";
import {
  getMenuItemsByRole,
  mainMenuItems,
  bottomMenuItems,
} from "../../config/menuConfig";
import useAuthStore from "../../store/authStore";
import { useAuth } from "../../hooks/useAuth";
import LogoutConfirmDialog from "../Modals/LogoutConfirmDialog";

const SIDEBAR_EXPANDED = 260;
const SIDEBAR_RAIL = 72;

/**
 * CSS-first rail below `md` (768): width and labels follow viewport,
 * independent of `collapsed`. On `md+`, `collapsed` controls expand/rail.
 */
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const { currentRole } = useAuthStore();
  const { logout, loading } = useAuth();

  const railOnMd = collapsed;

  const handleBottomItemClick = (path: string) => {
    if (path === "/login") {
      setLogoutDialogOpen(true);
      return;
    }
    navigate(path);
  };

  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false);
    await logout();
    navigate("/login");
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <Box
      sx={{
        width: {
          xs: SIDEBAR_RAIL,
          md: railOnMd ? SIDEBAR_RAIL : SIDEBAR_EXPANDED,
        },
        flexShrink: 0,
        height: "100%",
        minHeight: 0,
        backgroundColor: "var(--color-bg-default-primary)",
        borderRight: "1px solid var(--color-border-default-primary)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
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
          flexShrink: 0,
          justifyContent: {
            xs: "center",
            md: railOnMd ? "center" : "flex-start",
          },
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="factorlink-logo"
          sx={{
            maxWidth: 150,
            width: "100%",
            height: "auto",
            display: {
              xs: "none",
              md: railOnMd ? "none" : "block",
            },
          }}
        />
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            ml: {
              xs: 0,
              md: railOnMd ? 0 : "auto",
            },
            color: "text.secondary",
          }}
          size="small"
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          <Menu />
        </IconButton>
      </Box>

      <List
        sx={{
          px: 1,
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
        }}
      >
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
                    justifyContent: {
                      xs: "center",
                      md: railOnMd ? "center" : "flex-start",
                    },
                    px: {
                      xs: 1,
                      md: railOnMd ? 1 : 2,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: {
                        xs: 0,
                        md: railOnMd ? 0 : 40,
                      },
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
                  <ListItemText
                    primary={item.text}
                    sx={{
                      display: {
                        xs: "none",
                        md: railOnMd ? "none" : "block",
                      },
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
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>

      <List sx={{ px: 1, pb: 2, flexShrink: 0 }}>
        {currentRole?.contexto &&
          getMenuItemsByRole(bottomMenuItems, currentRole.role).map((item) => {
            const isLogout = item.path === "/login";
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleBottomItemClick(item.path)}
                  disabled={isLogout && loading}
                  sx={{
                    borderRadius: "var(--radius-m)",
                    "&:hover": {
                      backgroundColor: isLogout
                        ? "var(--color-bg-danger-tertiary)"
                        : "var(--color-bg-default-primary-hover)",
                    },
                    justifyContent: {
                      xs: "center",
                      md: railOnMd ? "center" : "flex-start",
                    },
                    px: {
                      xs: 1,
                      md: railOnMd ? 1 : 2,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: {
                        xs: 0,
                        md: railOnMd ? 0 : 40,
                      },
                      justifyContent: "center",
                    }}
                  >
                    <item.icon
                      sx={{
                        color: isLogout
                          ? "var(--color-fg-danger-primary)"
                          : "text.secondary",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      isLogout && loading ? "Cerrando sesión..." : item.text
                    }
                    sx={{
                      display: {
                        xs: "none",
                        md: railOnMd ? "none" : "block",
                      },
                      "& .MuiTypography-root": {
                        fontFamily: "var(--font-heading)",
                        color: isLogout
                          ? "var(--color-fg-danger-primary)"
                          : "text.secondary",
                        fontSize: "var(--font-size-s)",
                        fontWeight: isLogout ? 500 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>

      <LogoutConfirmDialog
        open={logoutDialogOpen}
        loading={loading}
        onCancel={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </Box>
  );
};

export default Sidebar;
