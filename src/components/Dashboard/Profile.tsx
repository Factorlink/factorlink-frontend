import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  KeyboardArrowDown,
  Logout,
  Warning,
  Edit,
  SwitchAccount,
  MailOutline,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import useAuthStore from "../../store/authStore";
import { useAuth } from "../../hooks/useAuth";
import { capitalizeFirstLetter } from "../../utils/utils";
import NotificationBell from "../Notificaciones/NotificationBell";

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const { user, currentRole } = useAuthStore();
  const { logout, loading } = useAuth();

  const minutesSinceUpdate = useMemo(() => {
    if (!user?.updatedAt) return 0;
    return Math.floor(
      (Date.now() - new Date(user.updatedAt).getTime()) / 60000,
    );
  }, [user?.updatedAt]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleClose();
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false);
    await logout();
    navigate("/login");
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleEditProfile = () => {
    handleClose();
    navigate("/edit");
  };

  const handleChangeRole = () => {
    handleClose();
    navigate("/role-selection");
  };

  const handleInvitations = () => {
    handleClose();
    navigate("/invitations");
  };

  const menuItems = [
    {
      icon: <Edit fontSize="small" />,
      text: "Editar Información",
      action: handleEditProfile,
    },
    {
      icon: <MailOutline fontSize="small" />,
      text: "Invitaciones",
      action: handleInvitations,
    },
    {
      icon: <SwitchAccount fontSize="small" />,
      text: "Cambiar de Rol",
      action: handleChangeRole,
    },
    {
      icon: <Logout fontSize="small" />,
      text: "Cerrar sesión",
      action: handleLogoutClick,
    },
  ];

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Actualizado hace {minutesSinceUpdate} minutos
        </Typography>

        <NotificationBell />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            borderRadius: "var(--radius-m)",
            px: 0.5,
            "&:hover": {
              backgroundColor: "var(--color-bg-default-primary-hover)",
            },
          }}
          onClick={handleClick}
        >
          <Avatar
            sx={{
              width: 44,
              height: 44,
              backgroundColor: "var(--color-bg-accent-secondary)",
              color: "var(--color-fg-accent-primary)",
              fontFamily: "var(--font-heading)",
              fontWeight: 500,
              fontSize: "var(--font-size-s)",
            }}
          >
            {user?.firstName?.charAt(0).toUpperCase() || ""}
            {user?.lastName?.charAt(0).toUpperCase() || ""}
          </Avatar>
          <Box>
            <Typography
              sx={{
                fontFamily: "var(--font-heading)",
                fontWeight: 500,
                fontSize: "var(--font-size-s)",
                color: "text.primary",
              }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: "var(--font-size-xs)",
              }}
            >
              {currentRole?.contexto === "empresa"
                ? currentRole?.empresa?.razonSocial || "N/A"
                : currentRole?.factoring?.razonSocial || "N/A"}
            </Typography>
          </Box>
          <KeyboardArrowDown
            sx={{
              color: "text.secondary",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform var(--duration-fast) var(--easing-ease)",
            }}
          />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: "var(--radius-m)",
                boxShadow: "var(--shadow-popover)",
                backgroundColor: "var(--color-bg-default-primary)",
                border: "1px solid var(--color-border-default-primary)",
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5, textAlign: "center" }}>
            {currentRole?.contexto && (
              <Chip
                label={capitalizeFirstLetter(currentRole?.contexto || "")}
                size="small"
                sx={{
                  backgroundColor: "var(--color-bg-accent-secondary)",
                  color: "var(--color-fg-accent-primary)",
                  fontWeight: 500,
                  fontFamily: "var(--font-heading)",
                }}
              />
            )}
          </Box>
          <Divider sx={{ borderColor: "var(--color-border-default-primary)" }} />
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              onClick={item.action}
              disabled={item.text === "Cerrar sesión" && loading}
              sx={{
                py: 1.5,
                color: "var(--color-fg-default-primary)",
                "&:hover": {
                  backgroundColor: "var(--color-bg-default-primary-hover)",
                },
              }}
            >
              <ListItemIcon
                sx={{ color: "var(--color-fg-default-secondary)", minWidth: 36 }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  item.text === "Cerrar sesión" && loading
                    ? "Cerrando sesión..."
                    : item.text
                }
                primaryTypographyProps={{
                  fontSize: "var(--font-size-s)",
                  color: "var(--color-fg-default-primary)",
                }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            borderRadius: "var(--radius-l)",
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontFamily: "var(--font-heading)",
            fontWeight: 500,
          }}
        >
          <Warning sx={{ color: "var(--color-fg-warning-primary)" }} />
          Confirmar cierre de sesión
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.secondary" }}>
            ¿Estás seguro de que deseas cerrar tu sesión? Tendrás que volver a
            iniciar sesión para acceder al sistema.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleLogoutCancel} variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? "Cerrando..." : "Cerrar sesión"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
