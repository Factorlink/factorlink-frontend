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
import { capitalizeFirstLetter } from "../../../utils/utils";
import { surface } from "../../../theme";
import {
  tableShellSx,
  tableScrollSx,
  tableWideSx,
} from "../../../theme/layoutStyles";

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
  if (role === ROLES.EMPRESA_ADMIN || role === ROLES.FACTORING_ADMIN)
    return "var(--color-fg-success-primary)";
  return "var(--color-fg-default-secondary)";
};

const getStatusConfig = (status: string | null) => {
  if (status !== "pendiente") {
    return {
      color: "var(--color-fg-success-primary)",
      bgColor: "var(--color-bg-success-secondary)",
      icon: <CheckCircleIcon sx={{ fontSize: 14, mr: 0.5 }} />,
    };
  }
  return {
    color: "var(--color-fg-warning-primary)",
    bgColor: "var(--color-bg-warning-secondary)",
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
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
        : currentRole?.factoringId,
    );
    return userRole?.role;
  };

  useEffect(() => {
    fetchUsers();
  }, [currentRole?.empresaId, currentRole?.factoringId, currentRole?.contexto]);

  const getUsersInvitationReesponse = (roles: Role[]) => {
    const userRole = getUserRole(
      roles,
      currentRole?.contexto,
      currentRole?.contexto === "empresa"
        ? currentRole?.empresaId
        : currentRole?.factoringId,
    );
    return currentRole?.contexto === "empresa"
      ? userRole?.empresa?.inviteAccepted
      : userRole?.factoring?.inviteAccepted;
  };

  const canInvite = () => {
    return (Number(currentRole?.nivel) || 0) >= 2 || currentRole?.factoring?.estadoEnrolamiento;
  }

  const totalUsers = users.length;
  const activeUsers = users.filter(
    (u) => getUsersInvitationReesponse(u.roles) === "aceptada",
  ).length;
  const pendingUsers = users.filter(
    (u) => getUsersInvitationReesponse(u.roles) === "pendiente",
  ).length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          ...surface.card,
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              backgroundColor: "var(--color-bg-default-tertiary)",
              borderRadius: "var(--radius-m)",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GroupIcon sx={{ color: "var(--color-fg-default-secondary)", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}>
              Gestión de Usuarios
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
              Administra los usuarios de tu empresa
            </Typography>
          </Box>
        </Box>
        {(canInvite()) && (<Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setInviteModalOpen(true)}
          sx={{
            backgroundColor: "var(--color-bg-accent-primary)",
            "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "var(--radius-m)",
            px: 3,
            color: "white",
          }}
        >
          Invitar Usuario
        </Button>) }
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Total Users */}
        <Box
          sx={{
            flex: 1,
            ...surface.card,
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <GroupIcon sx={{ color: "var(--color-fg-default-secondary)", fontSize: 24 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}>
              {totalUsers}
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
              Total usuarios
            </Typography>
          </Box>
        </Box>

        {/* Active Users */}
        <Box
          sx={{
            flex: 1,
            ...surface.card,
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <VerifiedUserIcon sx={{ color: "var(--color-fg-warning-primary)", fontSize: 24 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}>
              {activeUsers}
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
              Usuarios activos
            </Typography>
          </Box>
        </Box>

        {/* Pending Users */}
        <Box
          sx={{
            flex: 1,
            ...surface.card,
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <GroupIcon sx={{ color: "var(--color-fg-warning-primary)", fontSize: 24 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}>
              {pendingUsers}
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
              Pendientes
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Users Table */}
      <TableContainer
        component={Paper}
        sx={[tableShellSx, { borderRadius: "var(--radius-l)" }]}
      >
        <Box sx={tableScrollSx}>
        <Table sx={tableWideSx}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--color-bg-default-tertiary)" }}>
              <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>
                Usuario
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>
                Rol
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>
                Estado
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>
                Fecha Asociación
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>
                Último Acceso
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const userRole = getUserRole(
                user.roles,
                currentRole?.contexto,
                currentRole?.contexto === "empresa"
                  ? currentRole?.empresaId
                  : currentRole?.factoringId,
              );
              const inviteAccepted =
                currentRole?.contexto === "empresa"
                  ? userRole?.empresa?.inviteAccepted
                  : userRole?.factoring?.inviteAccepted;
              const statusConfig = getStatusConfig(inviteAccepted ?? null);

              const inviteDate =
                currentRole?.contexto === "empresa"
                  ? userRole?.empresa?.inviteDate
                  : userRole?.factoring?.inviteDate;
              return (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "var(--color-bg-neutral-secondary)",
                          color: "var(--color-fg-default-secondary)",
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
                          sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
                        >
                          {user.firstName} {user.lastName}
                          {user.isCurrentUser && (
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{ color: "var(--color-fg-default-secondary)", ml: 0.5 }}
                            >
                              (Tú)
                            </Typography>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<VerifiedUserIcon sx={{ fontSize: 14 }} />}
                      label={
                        ROLE_NAMES[
                          getUserRole(
                            user.roles,
                            currentRole?.contexto,
                            currentRole?.contexto === "empresa"
                              ? currentRole?.empresaId
                              : currentRole?.factoringId,
                          )?.role || ROLES.DEFAULT
                        ]
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
                            ? "var(--color-bg-success-secondary)"
                            : "var(--color-bg-neutral-secondary)",
                        color: getRoleColor(
                          getUserRole(
                            user.roles,
                            currentRole?.contexto,
                            currentRole?.contexto === "empresa"
                              ? currentRole?.empresaId
                              : currentRole?.factoringId,
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
                                : currentRole?.factoringId,
                            )?.role || "N/A",
                          ),
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={statusConfig.icon}
                      label={capitalizeFirstLetter(inviteAccepted ?? "")}
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
                    <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
                      {inviteDate
                        ? new Date(inviteDate).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
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
                      sx={{ color: "var(--color-fg-default-secondary)" }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </Box>
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
            borderRadius: "var(--radius-m)",
            boxShadow: "var(--shadow-popover)",
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleChangeRole}>
          <ListItemIcon>
            <SwapHorizIcon sx={{ color: "var(--color-fg-default-secondary)" }} />
          </ListItemIcon>
          <ListItemText primary="Cambiar rol" />
        </MenuItem>
        <MenuItem onClick={handleDeleteUser}>
          <ListItemIcon>
            <DeleteIcon sx={{ color: "var(--color-fg-danger-primary)" }} />
          </ListItemIcon>
          <ListItemText
            primary="Eliminar usuario"
            sx={{ "& .MuiTypography-root": { color: "var(--color-fg-danger-primary)" } }}
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
          fullName: selectedUser
            ? `${selectedUser.firstName} ${selectedUser.lastName}`
            : "",
        }}
      />
    </Box>
  );
};

export default Users;
