import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  KeyboardArrowDown,
  Notifications,
  Person,
  Business,
  SwapHoriz,
  Settings,
  Logout,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";
import useAuthStore from "../../store/authStore";
import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { logout, loading } = useAuth();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: <Person fontSize="small" />, text: "Suite Factoring", action: handleClose },
    { icon: <Business fontSize="small" />, text: "Suite Empresa", action: handleClose },
    { icon: <SwapHoriz fontSize="small" />, text: "Cambiar Empresa", action: handleClose },
    { icon: <Settings fontSize="small" />, text: "Configuración", action: handleClose },
    { icon: <Logout fontSize="small" />, text: "Logout", action: handleLogout },
  ];

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Actualizado hace 2 minutos
      </Typography>

      <IconButton
        sx={{
          backgroundColor: "success.main",
          color: "white",
          "&:hover": {
            backgroundColor: "success.dark",
          },
        }}
      >
        <Notifications />
      </IconButton>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <Avatar
          sx={{
            width: 44,
            height: 44,
            backgroundColor: "primary.light",
          }}
        >
          FO
        </Avatar>
        <Box>
          <Typography
            sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary" }}
          >
            { user?.firstName } {user?.lastName }
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontSize: "0.85rem" }}
          >
            Factorlink S.A
          </Typography>
        </Box>
        <KeyboardArrowDown
          sx={{
            color: "text.secondary",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
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
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              backgroundColor: "background.paper",
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, textAlign: "center" }}>
          <Chip
            label="Superadmin"
            size="small"
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              fontWeight: 500,
            }}
          />
        </Box>
        <Divider />
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={item.action}
            disabled={item.text === "Logout" && loading}
            sx={{
              py: 1.5,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ color: "text.secondary" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text === "Logout" && loading ? "Cerrando sesión..." : item.text}
              primaryTypographyProps={{
                fontSize: "0.9rem",
                color: "text.primary",
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Profile;
