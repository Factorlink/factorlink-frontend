import { useState, useEffect, type FC } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BusinessIcon from "@mui/icons-material/Business";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Layout from "../../components/Layout";
import { useInvitation } from "../../hooks/useInvitation";
import useAuthStore from "../../store/authStore";
import { useUsers } from "../../hooks/useUsers";
import {
  tableShellSx,
  tableScrollSx,
  tableCompactSx,
  pageHeaderSx,
  appContentSx,
} from "../../theme/layoutStyles";

interface Invitation {
  empresaId?: string;
  factoringId?: string;
  inviteDate: string;
  razonSocial: string;
  rut: string;
}

interface Invitations {
  empresas: Invitation[];
  factorings: Invitation[];
}

const Invitations: FC = () => {
  const [invitations, setInvitations] = useState<Invitations>({
    empresas: [],
    factorings: [],
  });
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { getMyInfo } = useUsers();
  const { user, setUser } = useAuthStore();

  const {
    getPendingInvites,
    respondEmpresaInvite,
    respondFactoringInvite,
    loading,
  } = useInvitation();

  const fetchInvitations = async () => {
    try {
      setLoadingData(true);
      setError(null);
      const data = await getPendingInvites();
      setInvitations(data || { empresas: [], factorings: [] });
    } catch {
      setError("Error al cargar las invitaciones");
    } finally {
      setLoadingData(false);
    }
  };

  const handleAccept = async (invitation: Invitation, type: string) => {
    try {
      setSuccessMessage(null);

      if (type === "empresa") {
        await respondEmpresaInvite({
          empresaId: invitation.empresaId || "",
          accept: true,
        });
      } else {
        await respondFactoringInvite({
          factoringId: invitation.factoringId || "",
          accept: true,
        });
      }

      const { user: updatedUser } = await getMyInfo();

      setUser({ ...user!, roles: updatedUser.roles });

      setSuccessMessage("Invitación aceptada correctamente");
      fetchInvitations();
    } catch (err) {
      setError("Error al aceptar la invitación");
      console.error("Error accepting invitation:", err);
    }
  };

  const handleReject = async (invitation: Invitation, type: string) => {
    try {
      setSuccessMessage(null);

      if (type === "empresa") {
        await respondEmpresaInvite({
          empresaId: invitation.empresaId || "",
          accept: false,
        });
      } else {
        await respondFactoringInvite({
          factoringId: invitation.factoringId || "",
          accept: false,
        });
      }

      setSuccessMessage("Invitación rechazada correctamente");
      fetchInvitations();
    } catch (err) {
      setError("Error al rechazar la invitación");
      console.error("Error rejecting invitation:", err);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const pendingCount =
    invitations.empresas.length + invitations.factorings.length;

  const getTypeConfig = (type: string) => {
    if (type === "empresa") {
      return {
        icon: <BusinessIcon sx={{ fontSize: 14, mr: 0.5 }} />,
        label: "Empresa",
        color: "var(--color-fg-accent-primary)",
        bgColor: "var(--color-bg-accent-secondary)",
      };
    }
    return {
      icon: <AccountBalanceIcon sx={{ fontSize: 14, mr: 0.5 }} />,
      label: "Factoring",
      color: "var(--color-fg-success-primary)",
      bgColor: "var(--color-bg-success-secondary)",
    };
  };

  return (
    <Layout>
      <Box sx={[appContentSx, { display: "flex", flexDirection: "column", gap: 3 }]}>
        <Box
          sx={[
            pageHeaderSx,
            {
              backgroundColor: "var(--color-bg-default-primary)",
              borderRadius: "var(--radius-l)",
              p: 3,
              mb: 0,
              boxShadow: "var(--shadow-card)",
              border: "1px solid var(--color-border-default-primary)",
            },
          ]}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
            <Box
              sx={{
                backgroundColor: "var(--color-bg-accent-primary)",
                borderRadius: "var(--radius-m)",
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MailOutlineIcon
                sx={{
                  color: "var(--color-fg-on-accent-primary)",
                  fontSize: 28,
                }}
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 500,
                  color: "var(--color-fg-default-primary)",
                }}
              >
                Invitaciones Pendientes
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
                Gestiona las invitaciones que has recibido para unirte a
                organizaciones
              </Typography>
            </Box>
          </Box>
          <Chip
            label={`${pendingCount} pendiente${pendingCount !== 1 ? "s" : ""}`}
            sx={{
              backgroundColor:
                pendingCount > 0
                  ? "var(--color-bg-warning-secondary)"
                  : "var(--color-bg-neutral-secondary)",
              color:
                pendingCount > 0
                  ? "var(--color-fg-warning-primary)"
                  : "var(--color-fg-default-secondary)",
              fontWeight: 500,
              fontFamily: "var(--font-heading)",
              flexShrink: 0,
            }}
          />
        </Box>

        {successMessage && (
          <Alert severity="success" onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loadingData && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loadingData && pendingCount === 0 && (
          <Box
            sx={{
              backgroundColor: "var(--color-bg-default-primary)",
              borderRadius: "var(--radius-l)",
              p: 6,
              textAlign: "center",
              boxShadow: "var(--shadow-card)",
              border: "1px solid var(--color-border-default-primary)",
            }}
          >
            <MailOutlineIcon
              sx={{
                fontSize: 64,
                color: "var(--color-fg-default-tertiary)",
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "var(--color-fg-default-secondary)",
                mb: 1,
                fontFamily: "var(--font-heading)",
                fontWeight: 500,
              }}
            >
              No tienes invitaciones pendientes
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-default-tertiary)" }}
            >
              Cuando alguien te invite a una organización, aparecerá aquí
            </Typography>
          </Box>
        )}

        {!loadingData && pendingCount > 0 && (
          <TableContainer
            component={Paper}
            sx={[
              tableShellSx,
              {
                borderRadius: "var(--radius-l)",
                border: "1px solid var(--color-border-default-primary)",
                backgroundColor: "var(--color-bg-default-primary)",
              },
            ]}
          >
            <Box sx={tableScrollSx}>
            <Table sx={tableCompactSx}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "var(--color-bg-default-tertiary)",
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: "var(--color-fg-default-secondary)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Organización
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: "var(--color-fg-default-secondary)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Tipo
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: "var(--color-fg-default-secondary)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Fecha
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: "var(--color-fg-default-secondary)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...invitations.empresas, ...invitations.factorings].map(
                  (invitation) => {
                    const typeConfig = getTypeConfig(
                      invitation.empresaId ? "empresa" : "factoring",
                    );
                    const isLoading = loading;

                    return (
                      <TableRow
                        key={invitation.empresaId || invitation.factoringId}
                        sx={{
                          "&:hover": {
                            backgroundColor:
                              "var(--color-bg-default-primary-hover)",
                          },
                          "&:last-child td": { borderBottom: 0 },
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: "var(--color-fg-default-primary)",
                            }}
                          >
                            {invitation.razonSocial}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={typeConfig.icon}
                            label={typeConfig.label}
                            size="small"
                            sx={{
                              backgroundColor: typeConfig.bgColor,
                              color: typeConfig.color,
                              fontWeight: 500,
                              "& .MuiChip-icon": {
                                color: typeConfig.color,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "var(--color-fg-default-secondary)",
                            }}
                          >
                            {invitation.inviteDate
                              ? new Date(
                                  invitation.inviteDate,
                                ).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={
                                isLoading ? (
                                  <CircularProgress
                                    size={14}
                                    color="inherit"
                                  />
                                ) : (
                                  <CheckCircleIcon />
                                )
                              }
                              onClick={() =>
                                handleAccept(
                                  invitation,
                                  invitation?.empresaId
                                    ? "empresa"
                                    : "factoring",
                                )
                              }
                              disabled={isLoading}
                              sx={{
                                textTransform: "none",
                                fontWeight: 500,
                                minWidth: 100,
                              }}
                            >
                              Aceptar
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={
                                isLoading ? (
                                  <CircularProgress
                                    size={14}
                                    color="inherit"
                                  />
                                ) : (
                                  <CancelIcon />
                                )
                              }
                              onClick={() =>
                                handleReject(
                                  invitation,
                                  invitation?.empresaId
                                    ? "empresa"
                                    : "factoring",
                                )
                              }
                              disabled={isLoading}
                              sx={{
                                textTransform: "none",
                                fontWeight: 500,
                                minWidth: 100,
                              }}
                            >
                              Rechazar
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  },
                )}
              </TableBody>
            </Table>
            </Box>
          </TableContainer>
        )}
      </Box>
    </Layout>
  );
};

export default Invitations;
