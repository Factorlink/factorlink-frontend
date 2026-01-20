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
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    } catch (err) {
      setError("Error al cargar las invitaciones");
      console.error("Error fetching invitations:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAccept = async (invitation: Invitation) => {
    /*try {
      setActionLoading(invitation.id);
      setSuccessMessage(null);
      
      if (invitation.type === "empresa") {
        await respondEmpresaInvite({
          empresaId: invitation.entityId,
          accept: true,
        });
      } else {
        await respondFactoringInvite({
          factoringId: invitation.entityId,
          accept: true,
        });
      }
      
      setSuccessMessage("Invitación aceptada correctamente");
      fetchInvitations();
    } catch (err) {
      setError("Error al aceptar la invitación");
      console.error("Error accepting invitation:", err);
    } finally {
      setActionLoading(null);
    }*/
  };

  const handleReject = async (invitation: Invitation) => {
    /*try {
      setActionLoading(invitation.id);
      setSuccessMessage(null);
      
      if (invitation.type === "empresa") {
        await respondEmpresaInvite({
          empresaId: invitation.entityId,
          accept: false,
        });
      } else {
        await respondFactoringInvite({
          factoringId: invitation.entityId,
          accept: false,
        });
      }
      
      setSuccessMessage("Invitación rechazada correctamente");
      fetchInvitations();
    } catch (err) {
      setError("Error al rechazar la invitación");
      console.error("Error rejecting invitation:", err);
    } finally {
      setActionLoading(null);
    }*/
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const getTypeConfig = (type: string) => {
    if (type === "empresa") {
      return {
        icon: <BusinessIcon sx={{ fontSize: 14, mr: 0.5 }} />,
        label: "Empresa",
        color: "#3B82F6",
        bgColor: "rgba(59, 130, 246, 0.1)",
      };
    }
    return {
      icon: <AccountBalanceIcon sx={{ fontSize: 14, mr: 0.5 }} />,
      label: "Factoring",
      color: "#8B5CF6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    };
  };

  return (
    <Layout>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Header Section */}
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                backgroundColor: "#00BCD4",
                borderRadius: 2,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MailOutlineIcon sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1E293B" }}
              >
                Invitaciones Pendientes
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                Gestiona las invitaciones que has recibido para unirte a
                organizaciones
              </Typography>
            </Box>
          </Box>
          <Chip
            label={`${invitations.empresas.length + invitations.factorings.length} pendiente${invitations.empresas.length + invitations.factorings.length !== 1 ? "s" : ""}`}
            sx={{
              backgroundColor:
                invitations.empresas.length + invitations.factorings.length > 0
                  ? "rgba(245, 158, 11, 0.1)"
                  : "rgba(100, 116, 139, 0.1)",
              color:
                invitations.empresas.length + invitations.factorings.length > 0
                  ? "#F59E0B"
                  : "#64748B",
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Alerts */}
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

        {/* Loading State */}
        {loadingData && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Empty State */}
        {!loadingData && (invitations.empresas.length + invitations.factorings.length) === 0 && (
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 3,
              p: 6,
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <MailOutlineIcon sx={{ fontSize: 64, color: "#CBD5E1", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#64748B", mb: 1 }}>
              No tienes invitaciones pendientes
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Cuando alguien te invite a una organización, aparecerá aquí
            </Typography>
          </Box>
        )}

        {/* Invitations Table */}
        {!loadingData && (invitations.empresas.length + invitations.factorings.length) > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                    Organización
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                    Tipo
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                    Rol Asignado
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                    Invitado por
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                    Fecha
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...invitations.empresas, ...invitations.factorings].map(
                  (invitation) => {
                    const typeConfig = getTypeConfig("empresa");
                    const isLoading = actionLoading;

                    return (
                      <TableRow
                        key={invitation.empresaId || invitation.factoringId}
                        sx={{
                          "&:hover": { backgroundColor: "#F8FAFC" },
                          "&:last-child td": { borderBottom: 0 },
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#1E293B" }}
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
                          <Typography variant="body2" sx={{ color: "#64748B" }}>
                            {"EMPRESA_USUARIO"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#64748B" }}>
                            {"PASCUAL"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#64748B" }}>
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
                              size="small"
                              startIcon={
                                isLoading ? (
                                  <CircularProgress size={14} color="inherit" />
                                ) : (
                                  <CheckCircleIcon />
                                )
                              }
                              onClick={() => handleAccept(invitation)}
                              disabled={isLoading}
                              sx={{
                                backgroundColor: "#00A86B",
                                "&:hover": { backgroundColor: "#008F5B" },
                                color: "white",
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                                minWidth: 100,
                              }}
                            >
                              Aceptar
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={
                                isLoading ? (
                                  <CircularProgress size={14} color="inherit" />
                                ) : (
                                  <CancelIcon />
                                )
                              }
                              onClick={() => handleReject(invitation)}
                              disabled={isLoading}
                              sx={{
                                borderColor: "#EF4444",
                                color: "#EF4444",
                                "&:hover": {
                                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                                  borderColor: "#EF4444",
                                },
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
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
          </TableContainer>
        )}
      </Box>
    </Layout>
  );
};

export default Invitations;
