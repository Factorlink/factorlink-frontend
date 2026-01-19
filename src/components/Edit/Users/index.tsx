import { useState, useEffect } from "react";
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
import type { User } from "../../../types/user";
import { useUsers } from "../../../hooks/useUsers";
import useAuthStore from "../../../store/authStore";
import InviteUserModal from "../../Modals/InviteUserModal";
import DeleteUserModal from "../../Modals/DeleteUserModal";
import type { Role } from "../../../types/role";
import { ROLE_NAMES, ROLES } from "../../../utils/consts";

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const getUserRole = (roles: Role[], contexto?: string, currentId?: string) => {
  if (contexto === "empresa") {
    return roles.find((role) => role.empresaId === currentId);
  } else if (contexto === "factoring") {
    return roles.find((role) => role.factoringId === currentId);
  }
};

const getRoleColor = (role: string) => {
  if (role === ROLES.EMPRESA_ADMIN || role === ROLES.FACTORING_ADMIN) return "#00A86B";
  return "#6B7280";
};

const getStatusConfig = (status: boolean) => {
  if (status) {
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { currentRole } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const { getUsersByEmpresaId, getUsersByFactoringId } = useUsers();

  const fetchUsers = async () => {
    try {
      const usersData =
        currentRole?.contexto === "empresa"
          ? await getUsersByEmpresaId(currentRole?.empresaId || "")
          : await getUsersByFactoringId(currentRole?.factoringId || "");
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    user: User,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleChangeRole = () => {
    setEditRoleModalOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteUser = () => {
    setDeleteModalOpen(true);
    setAnchorEl(null);
  };

  const getSelectedUserRole = () => {
    if (!selectedUser) return undefined;
    const userRole = getUserRole(
      selectedUser.roles,
      currentRole?.contexto,
      currentRole?.contexto === "empresa"
        ? currentRole?.empresaId
        : currentRole?.factoringId
    );
    return userRole?.role;
  };

  useEffect(() => {
    fetchUsers();
  }, [currentRole?.empresaId, currentRole?.factoringId, currentRole?.contexto]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const pendingUsers = users.filter((u) => !u.isActive).length;

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
          onClick={() => setInviteModalOpen(true)}
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
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Usuario
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Rol
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Estado
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Fecha Asociación
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Último Acceso
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const statusConfig = getStatusConfig(!!user.isActive);
              return (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:hover": { backgroundColor: "#F8FAFC" },
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
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
                      label={
                        ROLE_NAMES[getUserRole(
                          user.roles,
                          currentRole?.contexto,
                          currentRole?.contexto === "empresa"
                            ? currentRole?.empresaId
                            : currentRole?.factoringId,
                        )?.role || ROLES.DEFAULT]
                      }
                      size="small"
                      sx={{
                        backgroundColor:
                          getUserRole(
                            user.roles,
                            currentRole?.contexto,
                            currentRole?.contexto === "empresa"
                              ? currentRole?.empresaId
                              : currentRole?.factoringId,
                          )?.role === ROLES.EMPRESA_ADMIN
                            ? "rgba(0, 168, 107, 0.1)"
                            : "#F1F5F9",
                        color: getRoleColor(
                          getUserRole(
                            user.roles,
                            currentRole?.contexto,
                            currentRole?.contexto === "empresa" 
                            ? currentRole?.empresaId 
                            : currentRole?.factoringId
                          )?.role || "N/A",
                        ),
                        fontWeight: 500,
                        "& .MuiChip-icon": {
                          color: getRoleColor(
                          getUserRole(
                            user.roles,
                            currentRole?.contexto,
                            currentRole?.contexto === "empresa" 
                            ? currentRole?.empresaId 
                            : currentRole?.factoringId
                          )?.role || "N/A",
                        ),
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={statusConfig.icon}
                      label={user.isActive ? "Activo" : "Inactivo"}
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
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#64748B" }}>
                      {user?.updatedAt
                        ? new Date(user.updatedAt).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, user)}
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
        <MenuItem onClick={handleChangeRole}>
          <ListItemIcon>
            <SwapHorizIcon sx={{ color: "#64748B" }} />
          </ListItemIcon>
          <ListItemText primary="Cambiar rol" />
        </MenuItem>
        <MenuItem onClick={handleDeleteUser}>
          <ListItemIcon>
            <DeleteIcon sx={{ color: "#EF4444" }} />
          </ListItemIcon>
          <ListItemText
            primary="Eliminar usuario"
            sx={{ "& .MuiTypography-root": { color: "#EF4444" } }}
          />
        </MenuItem>
      </Menu>

      {/* Invite User Modal */}
      <InviteUserModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onSuccess={fetchUsers}
      />

      {/* Edit Role Modal */}
      <InviteUserModal
        open={editRoleModalOpen}
        onClose={() => {
          setEditRoleModalOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={() => {
          fetchUsers();
        }}
        mode="edit"
        userData={{
          email: selectedUser?.email || "",
          currentRole: getSelectedUserRole(),
        }}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={() => {
          fetchUsers();
        }}
        userData={{
          email: selectedUser?.email || "",
          fullName: selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : "",
        }}
      />
    </Box>
  );
};

export default Users;
