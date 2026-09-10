import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  Delete,
  Description,
  ErrorOutline,
  Send,
  Storefront,
  Visibility,
} from "@mui/icons-material";
import Layout from "../../../../components/Layout";
import SectionPanel from "../../../../components/SectionPanel";
import DocumentsRequiredModal from "../../../../components/Modals/DocumentsRequiredModal";
import FacturaDetalleDrawer from "../../../../components/Facturas/FacturaDetalleDrawer";
import { formatCurrency } from "../../../../components/Facturas/FacturaResumenCard";
import { useFacturaGrupos } from "../../../../hooks/useFacturaGrupos";
import useAuthStore from "../../../../store/authStore";
import type { Factura, FacturaGrupo } from "../../../../types/factura";
import { getFacturaStatusConfig } from "../../../../theme";
import {
  getFacturaGrupoMontoFinanciar,
  getFacturaGrupoMontoTotal,
} from "../../../../utils/facturaGrupo";
import {
  appContentSx,
  tableScrollSx,
  tableShellSx,
  tableWideSx,
} from "../../../../theme/layoutStyles";

const normalizeGrupoEstado = (estado?: string) =>
  (estado || "").trim().toUpperCase();

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const visibilidadLabel = (visibilidad?: string) => {
  if (visibilidad === "SELECCIONADOS") return "Solo Factorings seleccionados";
  if (visibilidad === "TODOS") return "Todos los Factorings";
  return visibilidad || "—";
};

const headerCellSx = {
  fontWeight: 600,
  color: "var(--color-fg-default-secondary)",
} as const;

const FacturaGrupoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentRole } = useAuthStore();
  const {
    getFacturaGrupoById,
    getFacturaGrupoFacturas,
    deleteFacturaGrupo,
    removeFacturaGrupoFromMarketplace,
    sendFacturaGrupoToMarketplace,
  } = useFacturaGrupos();

  const [grupo, setGrupo] = useState<FacturaGrupo | null>(null);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [documentsRequiredModalOpen, setDocumentsRequiredModalOpen] =
    useState(false);
  const [detalleFacturaId, setDetalleFacturaId] = useState<string | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);

  const goToGrupos = (replace = false) => {
    navigate("/facturas/grupos", { replace });
  };

  const loadDetalle = useCallback(async () => {
    if (!id) {
      setLoadingPage(false);
      setLoadError("No se encontró el grupo.");
      return;
    }
    setLoadingPage(true);
    setLoadError(null);
    try {
      const [grupoData, facturasData] = await Promise.all([
        getFacturaGrupoById(id),
        getFacturaGrupoFacturas(id),
      ]);
      setGrupo(grupoData);
      setFacturas(facturasData || []);
    } catch (err) {
      console.error("Error loading factura grupo:", err);
      setGrupo(null);
      setFacturas([]);
      setLoadError("No se pudo cargar el grupo. Intente nuevamente.");
    } finally {
      setLoadingPage(false);
    }
    // hook methods are recreated every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    void loadDetalle();
  }, [loadDetalle]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      setDeleting(true);
      setDeleteError(null);
      await deleteFacturaGrupo(id);
      goToGrupos(true);
    } catch (err) {
      console.error("Error deleting factura grupo:", err);
      setDeleteError("No se pudo eliminar el grupo. Intente nuevamente.");
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleRemoveFromMarketplace = async () => {
    if (!id) return;
    try {
      setRemoving(true);
      setRemoveError(null);
      await removeFacturaGrupoFromMarketplace(id);
      setRemoveConfirmOpen(false);
      await loadDetalle();
    } catch (err) {
      console.error("Error removing factura grupo from marketplace:", err);
      setRemoveError(
        "No se pudo quitar el grupo del marketplace. Intente nuevamente.",
      );
    } finally {
      setRemoving(false);
    }
  };

  const openSendConfirm = () => {
    if (!currentRole || currentRole.nivel < 3) {
      setDocumentsRequiredModalOpen(true);
      return;
    }
    setSendError(null);
    setSendConfirmOpen(true);
  };

  const handleSendToMarketplace = async () => {
    if (!id) return;
    try {
      setSending(true);
      setSendError(null);
      await sendFacturaGrupoToMarketplace(id);
      setSendConfirmOpen(false);
      await loadDetalle();
    } catch (err) {
      console.error("Error sending factura grupo to marketplace:", err);
      setSendError(
        "No se pudo enviar el grupo al marketplace. Intente nuevamente.",
      );
    } finally {
      setSending(false);
    }
  };

  const montoTotal =
    facturas.length > 0
      ? facturas.reduce((sum, f) => {
          const n = parseFloat(f.montoTotal);
          return sum + (Number.isFinite(n) ? n : 0);
        }, 0)
      : getFacturaGrupoMontoTotal(grupo);
  const montoFinanciar = getFacturaGrupoMontoFinanciar(grupo);
  const statusConfig = getFacturaStatusConfig(grupo?.estado || "");
  const grupoEstado = normalizeGrupoEstado(grupo?.estado);
  const canDelete = grupoEstado === "CARGADA";
  const canSendToMarketplace = grupoEstado === "CARGADA";
  const canRemoveFromMarketplace = grupoEstado === "EN_MARKETPLACE";

  if (loadingPage) {
    return (
      <Layout>
        <Box sx={appContentSx}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        </Box>
      </Layout>
    );
  }

  if (loadError || !grupo) {
    return (
      <Layout>
        <Box sx={appContentSx}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => goToGrupos()}
            sx={{
              mb: 2,
              color: "var(--color-fg-default-secondary)",
              textTransform: "none",
            }}
          >
            Volver a grupos
          </Button>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40vh",
              gap: 2,
            }}
          >
            <ErrorOutline
              sx={{ fontSize: 64, color: "var(--color-fg-danger-primary)" }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {loadError || "Grupo no encontrado"}
            </Typography>
            <Button
              variant="contained"
              onClick={() => void loadDetalle()}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "var(--color-fg-on-accent-primary)",
              }}
            >
              Reintentar
            </Button>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={appContentSx}>
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => goToGrupos()}
            sx={{
              color: "var(--color-fg-default-secondary)",
              textTransform: "none",
              "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
            }}
          >
            Volver a grupos
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}
          >
            Detalle del grupo: {grupo.nombre || "—"}
          </Typography>
          {grupo.estado && (
            <Chip
              icon={statusConfig.icon as React.ReactElement}
              label={statusConfig.label}
              size="small"
              sx={{
                backgroundColor: statusConfig.bgColor,
                color: statusConfig.color,
                fontWeight: 600,
                "& .MuiChip-icon": { color: statusConfig.color },
              }}
            />
          )}
        </Box>

        {deleteError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setDeleteError(null)}
          >
            {deleteError}
          </Alert>
        )}

        {removeError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setRemoveError(null)}
          >
            {removeError}
          </Alert>
        )}

        {sendError && !sendConfirmOpen && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setSendError(null)}
          >
            {sendError}
          </Alert>
        )}

        <SectionPanel
          title="Información del grupo"
          icon={
            <Description
              sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }}
            />
          }
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "var(--color-fg-default-secondary)" }}
                >
                  Nombre del grupo
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {grupo.nombre || "—"}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "var(--color-fg-default-secondary)" }}
                >
                  Visibilidad
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {visibilidadLabel(grupo.visibilidad)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "var(--color-fg-default-secondary)" }}
                  >
                    Porcentaje a financiar
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {grupo.porcentajeFinanciamiento != null
                      ? `${grupo.porcentajeFinanciamiento}%`
                      : "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "var(--color-fg-default-secondary)" }}
                  >
                    Plazo
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {grupo.plazo != null ? `${grupo.plazo} días` : "—"}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                p: 2,
                borderRadius: "var(--radius-m)",
                backgroundColor: "var(--color-bg-default-tertiary)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--color-fg-default-secondary)" }}
                >
                  Facturas en el grupo
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {facturas.length}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--color-fg-default-secondary)" }}
                >
                  Monto total del grupo
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {formatCurrency(montoTotal)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--color-fg-default-secondary)" }}
                >
                  Monto a financiar aprox.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "var(--color-fg-success-primary)",
                  }}
                >
                  {formatCurrency(montoFinanciar)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </SectionPanel>

        <SectionPanel
          title={`Facturas del grupo (${facturas.length})`}
          icon={
            <Description
              sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }}
            />
          }
        >
          {facturas.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-default-secondary)" }}
            >
              Este grupo no tiene facturas asociadas.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={[tableShellSx, { mb: 0 }]}>
              <Box sx={tableScrollSx}>
                <Table sx={tableWideSx} size="small">
                  <TableHead>
                    <TableRow
                      sx={{ backgroundColor: "var(--color-bg-default-tertiary)" }}
                    >
                      <TableCell sx={headerCellSx}>Folio</TableCell>
                      <TableCell sx={headerCellSx}>Receptor</TableCell>
                      <TableCell sx={headerCellSx}>Fecha emisión</TableCell>
                      <TableCell sx={headerCellSx}>Monto</TableCell>
                      <TableCell sx={headerCellSx}>Estado</TableCell>
                      <TableCell sx={headerCellSx}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {facturas.map((factura) => {
                      const facturaStatus = getFacturaStatusConfig(
                        factura.estado || "",
                      );
                      return (
                        <TableRow
                          key={factura.id}
                          sx={{
                            "&:hover": {
                              backgroundColor:
                                "var(--color-bg-default-tertiary)",
                            },
                            "&:last-child td": { borderBottom: 0 },
                          }}
                        >
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "var(--color-fg-accent-primary)",
                                fontWeight: 600,
                              }}
                            >
                              #{factura.folio}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: "var(--color-fg-default-primary)",
                              }}
                            >
                              {factura.razonSocialReceptor || "N/A"}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "var(--color-fg-default-secondary)",
                              }}
                            >
                              {factura.rutReceptor || ""}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(factura.fechaEmision)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {formatCurrency(factura.montoTotal)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={facturaStatus.icon as React.ReactElement}
                              label={facturaStatus.label}
                              size="small"
                              sx={{
                                backgroundColor: facturaStatus.bgColor,
                                color: facturaStatus.color,
                                fontWeight: 500,
                                "& .MuiChip-icon": {
                                  color: facturaStatus.color,
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Ver detalle">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setDetalleFacturaId(factura.id);
                                  setDetalleOpen(true);
                                }}
                                sx={{
                                  color: "var(--color-fg-default-secondary)",
                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </TableContainer>
          )}
        </SectionPanel>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => goToGrupos()}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderColor: "var(--color-fg-default-secondary)",
              color: "var(--color-fg-default-secondary)",
            }}
          >
            Volver
          </Button>
          {canRemoveFromMarketplace && (
            <Button
              variant="outlined"
              startIcon={<Storefront />}
              onClick={() => {
                setRemoveError(null);
                setRemoveConfirmOpen(true);
              }}
              disabled={removing}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "var(--color-fg-danger-primary)",
                borderColor: "var(--color-border-danger-secondary)",
                "&:hover": {
                  borderColor: "var(--color-border-danger-secondary)",
                  backgroundColor: "var(--color-bg-danger-secondary)",
                },
              }}
            >
              Quitar grupo del Marketplace
            </Button>
          )}
          {(canDelete || canSendToMarketplace) && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {canDelete && (
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={() => setConfirmOpen(true)}
                  disabled={deleting || sending}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "var(--color-fg-danger-primary)",
                    borderColor: "var(--color-border-danger-secondary)",
                    "&:hover": {
                      borderColor: "var(--color-border-danger-secondary)",
                      backgroundColor: "var(--color-bg-danger-secondary)",
                    },
                  }}
                >
                  Eliminar grupo
                </Button>
              )}
              {canSendToMarketplace && (
                <Button
                  variant="contained"
                  startIcon={sending ? undefined : <Send />}
                  onClick={openSendConfirm}
                  disabled={sending || deleting}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "var(--color-fg-on-accent-primary)",
                    backgroundColor: "var(--color-bg-accent-primary)",
                    "&:hover": {
                      backgroundColor: "var(--color-bg-accent-primary-hover)",
                    },
                    "&:disabled": {
                      backgroundColor: "var(--color-bg-disabled-primary)",
                    },
                  }}
                >
                  {sending ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Enviar a Marketplace"
                  )}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Dialog
        open={confirmOpen}
        onClose={() => !deleting && setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "var(--radius-l)" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Eliminar grupo</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ¿Estás seguro de que deseas eliminar este grupo? Esta acción no se
            puede deshacer.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {grupo.nombre || "Grupo"}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            disabled={deleting}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              void handleDelete();
            }}
            disabled={deleting}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "var(--color-fg-on-accent-primary)",
              backgroundColor: "var(--color-bg-danger-primary)",
              "&:hover": {
                backgroundColor: "var(--color-bg-danger-primary-hover)",
              },
            }}
          >
            {deleting ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={removeConfirmOpen}
        onClose={() => !removing && setRemoveConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "var(--radius-l)" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          ¿Quitar del marketplace?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            El grupo será retirado del marketplace y dejará de estar visible
            para los factoring. Podrás volver a enviarlo a cotizar más adelante.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {grupo.nombre || "Grupo"} · {facturas.length} factura
            {facturas.length === 1 ? "" : "s"}
          </Typography>
          {removeError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {removeError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setRemoveConfirmOpen(false)}
            disabled={removing}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              void handleRemoveFromMarketplace();
            }}
            disabled={removing}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "var(--color-fg-on-accent-primary)",
              backgroundColor: "var(--color-bg-danger-primary)",
              "&:hover": {
                backgroundColor: "var(--color-bg-danger-primary-hover)",
              },
            }}
          >
            {removing ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Quitar del marketplace"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={sendConfirmOpen}
        onClose={() => !sending && setSendConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "var(--radius-l)" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          ¿Enviar a marketplace?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            El grupo quedará visible en el marketplace según su configuración de
            visibilidad para que los factoring puedan enviar ofertas.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {grupo.nombre || "Grupo"} · {facturas.length} factura
            {facturas.length === 1 ? "" : "s"}
          </Typography>
          {sendError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {sendError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setSendConfirmOpen(false)}
            disabled={sending}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              void handleSendToMarketplace();
            }}
            disabled={sending}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "var(--color-fg-on-accent-primary)",
              backgroundColor: "var(--color-bg-accent-primary)",
              "&:hover": {
                backgroundColor: "var(--color-bg-accent-primary-hover)",
              },
            }}
          >
            {sending ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Enviar a Marketplace"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <DocumentsRequiredModal
        open={documentsRequiredModalOpen}
        onClose={() => setDocumentsRequiredModalOpen(false)}
      />

      <FacturaDetalleDrawer
        open={detalleOpen}
        onClose={() => {
          setDetalleOpen(false);
          setDetalleFacturaId(null);
        }}
        facturaId={detalleFacturaId}
        onDeleted={() => {
          setDetalleOpen(false);
          setDetalleFacturaId(null);
          void loadDetalle();
        }}
        onFacturaUpdated={() => {
          void loadDetalle();
        }}
      />
    </Layout>
  );
};

export default FacturaGrupoDetalle;
