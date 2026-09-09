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
  Visibility,
} from "@mui/icons-material";
import Layout from "../../../../components/Layout";
import SectionPanel from "../../../../components/SectionPanel";
import { formatCurrency } from "../../../../components/Facturas/FacturaResumenCard";
import { useFacturaGrupos } from "../../../../hooks/useFacturaGrupos";
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
  const {
    getFacturaGrupoById,
    getFacturaGrupoFacturas,
    deleteFacturaGrupo,
  } = useFacturaGrupos();

  const [grupo, setGrupo] = useState<FacturaGrupo | null>(null);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const montoTotal =
    facturas.length > 0
      ? facturas.reduce((sum, f) => {
          const n = parseFloat(f.montoTotal);
          return sum + (Number.isFinite(n) ? n : 0);
        }, 0)
      : getFacturaGrupoMontoTotal(grupo);
  const montoFinanciar = getFacturaGrupoMontoFinanciar(grupo);
  const statusConfig = getFacturaStatusConfig(grupo?.estado || "");

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
                                onClick={() =>
                                  navigate(`/facturas/${factura.id}`)
                                }
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
          <Button
            variant="outlined"
            startIcon={<Delete />}
            onClick={() => setConfirmOpen(true)}
            disabled={deleting}
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
            {grupo.nombre || "Grupo"} · {id}
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
            onClick={handleDelete}
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
    </Layout>
  );
};

export default FacturaGrupoDetalle;
