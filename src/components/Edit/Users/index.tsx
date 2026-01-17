import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PendingIcon from "@mui/icons-material/Pending";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Mock data for layout purposes
const mockUsers = [
  {
    id: "1",
    firstName: "Admin",
    lastName: "Empresa",
    email: "admin@factorlink.cl",
    role: "Admin Empresa",
    status: "Activo",
    fechaAsociacion: "31 dic 2023",
    ultimoAcceso: "19 ene 2024, 20:00",
    isCurrentUser: true,
  },
  {
    id: "2",
    firstName: "María",
    lastName: "González",
    email: "maria.gonzalez@factorlink.cl",
    role: "Usuario Empresa",
    status: "Activo",
    fechaAsociacion: "09 ene 2024",
    ultimoAcceso: "18 ene 2024, 20:00",
    isCurrentUser: false,
  },
  {
    id: "3",
    firstName: "Carlos",
    lastName: "Rodríguez",
    email: "carlos.rodriguez@factorlink.cl",
    role: "Usuario Empresa",
    status: "Pendiente",
    fechaAsociacion: "14 ene 2024",
    ultimoAcceso: "-",
    isCurrentUser: false,
  },
];

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const getRoleColor = (role: string) => {
  if (role === "Admin Empresa") return "#00A86B";
  return "#6B7280";
};

const getStatusConfig = (status: string) => {
  if (status === "Activo") {
    return {
      color: "#00A86B",
      bgColor: "rgba(0, 168, 107, 0.1)",
      icon: <CheckCircleIcon sx={{ fontSize: 14, mr: 0.5 }} />,
    };
  }
  return {
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.1)",
    icon: <PendingIcon sx={{ fontSize: 14, mr: 0.5 }} />,
  };
};

const Users = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [_selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter((u) => u.status === "Activo").length;
  const pendingUsers = mockUsers.filter((u) => u.status === "Pendiente").length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GroupIcon sx={{ color: "#64748B", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1E293B" }}>
              Gestión de Usuarios
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Administra los usuarios de tu empresa
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          sx={{
            backgroundColor: "#00BCD4;",
            "&:hover": { backgroundColor: "#00BCD4;" },
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            color: "white",
          }}
        >
          Invitar Usuario
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Total Users */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 3,
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <GroupIcon sx={{ color: "#64748B", fontSize: 24 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1E293B" }}>
              {totalUsers}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Total usuarios
            </Typography>
          </Box>
        </Box>

        {/* Active Users */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 3,
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <VerifiedUserIcon sx={{ color: "#F59E0B", fontSize: 24 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1E293B" }}>
              {activeUsers}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Usuarios activos
            </Typography>
          </Box>
        </Box>

        {/* Pending Users */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 3,
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <GroupIcon sx={{ color: "#F97316", fontSize: 24 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1E293B" }}>
              {pendingUsers}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Pendientes
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Users Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>Usuario</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>Rol</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Fecha Asociación
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Último Acceso
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockUsers.map((user) => {
              const statusConfig = getStatusConfig(user.status);
              return (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:hover": { backgroundColor: "#F8FAFC" },
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        sx={{
                          bgcolor: "#E0E7EF",
                          color: "#64748B",
                          fontWeight: 600,
                          fontSize: 14,
                          width: 36,
                          height: 36,
                        }}
                      >
                        {getInitials(user.firstName, user.lastName)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#1E293B" }}
                        >
                          {user.firstName} {user.lastName}
                          {user.isCurrentUser && (
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{ color: "#64748B", ml: 0.5 }}
                            >
                              (Tú)
                            </Typography>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#64748B" }}>
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<VerifiedUserIcon sx={{ fontSize: 14 }} />}
                      label={user.role}
                      size="small"
                      sx={{
                        backgroundColor:
                          user.role === "Admin Empresa"
                            ? "rgba(0, 168, 107, 0.1)"
                            : "#F1F5F9",
                        color: getRoleColor(user.role),
                        fontWeight: 500,
                        "& .MuiChip-icon": {
                          color: getRoleColor(user.role),
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={statusConfig.icon}
                      label={user.status}
                      size="small"
                      sx={{
                        backgroundColor: statusConfig.bgColor,
                        color: statusConfig.color,
                        fontWeight: 500,
                        "& .MuiChip-icon": {
                          color: statusConfig.color,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#64748B" }}>
                      {user.fechaAsociacion}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#64748B" }}>
                      {user.ultimoAcceso}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, user.id)}
                      sx={{ color: "#64748B" }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <SwapHorizIcon sx={{ color: "#64748B" }} />
          </ListItemIcon>
          <ListItemText primary="Cambiar rol" />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DeleteIcon sx={{ color: "#EF4444" }} />
          </ListItemIcon>
          <ListItemText
            primary="Eliminar usuario"
            sx={{ "& .MuiTypography-root": { color: "#EF4444" } }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Users;
