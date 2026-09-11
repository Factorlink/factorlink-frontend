import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  Snackbar,
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
  Description,
  ErrorOutline,
  InfoOutlined,
  Send,
  Visibility,
} from "@mui/icons-material";
import Layout from "../../../../../components/Layout";
import SectionPanel from "../../../../../components/SectionPanel";
import FacturaGrupoFactoringDetalleDrawer from "../../../../../components/Facturas/FacturaGrupoFactoringDetalleDrawer";
import { formatCurrency } from "../../../../../components/Facturas/FacturaResumenCard";
import { useFacturaGrupos } from "../../../../../hooks/useFacturaGrupos";
import { useOfertas } from "../../../../../hooks/useOfertas";
import useAuthStore from "../../../../../store/authStore";
import type { Factura, FacturaGrupo } from "../../../../../types/factura";
import { getFacturaStatusConfig } from "../../../../../theme";
import {
  getFacturaGrupoMontoFinanciar,
  getFacturaGrupoMontoTotal,
} from "../../../../../utils/facturaGrupo";
import {
  canEnviarOfertaAlGrupo,
  getFacturaGrupoOfertaDisplay,
  grupoTieneOfertaEnviada,
  type OfertaGrupoBorrador,
} from "../../../../../utils/facturaGrupoOferta";
import { buildCreateOfertaPayload } from "../../../../../utils/ofertaPayload";
import {
  appContentSx,
  tableScrollSx,
  tableShellSx,
  tableWideSx,
} from "../../../../../theme/layoutStyles";

type GrupoFactoringLocationState = {
  from?: string;
  nombre?: string;
};

const getMarketplaceBackPath = (from: unknown) => {
  if (typeof from === "string" && from.startsWith("/marketplace")) {
    return from;
  }
  return "/marketplace";
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const headerCellSx = {
  fontWeight: 600,
  color: "var(--color-fg-default-secondary)",
} as const;

const FacturaGrupoOfertaCell = ({
  factura,
  hasBorrador,
}: {
  factura: Factura;
  hasBorrador: boolean;
}) => {
  const display = getFacturaGrupoOfertaDisplay(factura, hasBorrador);

  if (display.kind === "sin_oferta") {
    return (
      <Typography
        variant="body2"
        sx={{ color: "var(--color-fg-default-tertiary)" }}
      >
        {display.label}
      </Typography>
    );
  }

  return (
    <Chip
      label={display.label}
      size="small"
      sx={{
        fontWeight: 500,
        backgroundColor: "var(--color-bg-accent-secondary)",
        color: "var(--color-fg-accent-primary)",
      }}
    />
  );
};

const FacturaGrupoFactoringDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole } = useAuthStore();
  const { getFacturaGrupoById, getFacturaGrupoFacturasFactoring } =
    useFacturaGrupos();
  const { createOfertasGrupoFacturas, loading: sendingOfertas } = useOfertas();
  const factoringId = currentRole?.factoringId || "";

  const state = (location.state as GrupoFactoringLocationState | null) ?? null;
  const backPath = getMarketplaceBackPath(state?.from);

  const [grupo, setGrupo] = useState<FacturaGrupo | null>(null);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [borradores, setBorradores] = useState<
    Record<string, OfertaGrupoBorrador>
  >({});
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [detalleFacturaId, setDetalleFacturaId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendErrorReason, setSendErrorReason] = useState<string | null>(null);
  const [sendSuccessOpen, setSendSuccessOpen] = useState(false);

  const loadDetalle = useCallback(async () => {
    if (!id) {
      setLoadingPage(false);
      setLoadError("No se encontró el grupo.");
      return;
    }
    if (!factoringId) {
      setLoadingPage(false);
      setLoadError("No se encontró el factoring activo.");
      return;
    }
    setLoadingPage(true);
    setLoadError(null);
    try {
      const [grupoData, facturasData] = await Promise.all([
        getFacturaGrupoById(id, { factoringId }),
        getFacturaGrupoFacturasFactoring(id, factoringId),
      ]);
      setGrupo(grupoData);
      setFacturas(facturasData || []);
    } catch (err) {
      console.error("Error loading factura grupo factoring:", err);
      setGrupo(null);
      setFacturas([]);
      setLoadError("No se pudo cargar el grupo. Intente nuevamente.");
    } finally {
      setLoadingPage(false);
    }
    // hook methods are recreated every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, factoringId]);

  useEffect(() => {
    void loadDetalle();
  }, [loadDetalle]);

  const grupoBloqueado = useMemo(
    () => grupoTieneOfertaEnviada(facturas),
    [facturas],
  );

  useEffect(() => {
    if (grupoBloqueado) {
      setBorradores({});
    }
  }, [grupoBloqueado]);

  const handleBack = () => {
    navigate(backPath);
  };

  const handleVerDetalle = (factura: Factura) => {
    setDetalleFacturaId(factura.id);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    if (sendingOfertas) return;
    setDrawerOpen(false);
    setDetalleFacturaId(null);
  };

  const handleSaveBorrador = (borrador: OfertaGrupoBorrador) => {
    if (grupoBloqueado) return;
    setBorradores((prev) => ({
      ...prev,
      [borrador.facturaId]: borrador,
    }));
  };

  const handleDeleteBorrador = (facturaId: string) => {
    setBorradores((prev) => {
      const next = { ...prev };
      delete next[facturaId];
      return next;
    });
  };

  const handleEnviarOfertaAlGrupo = () => {
    if (!canEnviarOfertaAlGrupo(borradores, facturas) || !id) return;
    setSendError(null);
    setSendErrorReason(null);
    setSendConfirmOpen(true);
  };

  const handleConfirmEnviarOfertaAlGrupo = async () => {
    if (!id || !canEnviarOfertaAlGrupo(borradores, facturas)) return;
    try {
      setSendError(null);
      setSendErrorReason(null);
      const ofertas = Object.values(borradores).map((borrador) =>
        buildCreateOfertaPayload(borrador),
      );
      await createOfertasGrupoFacturas({
        facturaGrupoId: id,
        ofertas,
      });
      setBorradores({});
      setSendConfirmOpen(false);
      setSendSuccessOpen(true);
      await loadDetalle();
    } catch (err) {
      console.error("Error sending ofertas grupo facturas:", err);
      const axiosError = err as {
        response?: { data?: { message?: string; reason?: string } };
      };
      setSendError(
        axiosError?.response?.data?.message ||
          "No se pudo enviar la oferta al grupo. Intente nuevamente.",
      );
      setSendErrorReason(axiosError?.response?.data?.reason || null);
    }
  };

  const montoTotal = useMemo(() => {
    if (facturas.length > 0) {
      return facturas.reduce((sum, factura) => {
        const n =
          typeof factura.montoTotal === "string"
            ? parseFloat(factura.montoTotal)
            : Number(factura.montoTotal);
        return sum + (Number.isFinite(n) ? n : 0);
      }, 0);
    }
    return getFacturaGrupoMontoTotal(grupo);
  }, [facturas, grupo]);

  const montoFinanciar = getFacturaGrupoMontoFinanciar(grupo);
  const canSend = canEnviarOfertaAlGrupo(borradores, facturas);
  const borradoresCount = Object.keys(borradores).length;
  const statusConfig = getFacturaStatusConfig(grupo?.estado || "");
  const tituloNombre =
    grupo?.nombre?.trim() || state?.nombre?.trim() || "Grupo de cotización";

  if (loadingPage) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
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
            onClick={handleBack}
            sx={{
              mb: 2,
              color: "var(--color-fg-default-secondary)",
              textTransform: "none",
            }}
          >
            Volver al marketplace
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
      <Box sx={{ ...appContentSx, pb: 12 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{
            mb: 2,
            color: "var(--color-fg-default-secondary)",
            textTransform: "none",
            "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
          }}
        >
          Volver al marketplace
        </Button>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1.5,
            mb: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}
          >
            Detalle del grupo: {tituloNombre}
          </Typography>
          {grupo.estado && (
            <Chip
              icon={statusConfig.icon as ReactElement}
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

        <Typography
          variant="body2"
          sx={{ color: "var(--color-fg-default-secondary)", mb: 3 }}
        >
          {grupoBloqueado
            ? "Ya se envió una oferta en este grupo. Puedes revisar el detalle de cada factura y su historial."
            : "Revisa la información del grupo y las facturas asociadas. Debes completar al menos una oferta para enviar al grupo."}
        </Typography>

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
                {Boolean(grupo.descripcion?.trim()) && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "var(--color-fg-default-secondary)" }}
                    >
                      Descripción
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {grupo.descripcion}
                    </Typography>
                  </Box>
                )}
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
            title={`Facturas asociadas al grupo (${facturas.length})`}
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
                Este grupo aún no tiene facturas asociadas.
              </Typography>
            ) : (
              <>
                <TableContainer sx={tableShellSx}>
                  <Box sx={tableScrollSx}>
                    <Table sx={tableWideSx}>
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor:
                              "var(--color-bg-default-tertiary)",
                          }}
                        >
                          <TableCell sx={headerCellSx}>Folio</TableCell>
                          <TableCell sx={headerCellSx}>Receptor</TableCell>
                          <TableCell sx={headerCellSx}>Fecha emisión</TableCell>
                          <TableCell sx={headerCellSx}>Monto total</TableCell>
                          <TableCell sx={headerCellSx}>Oferta</TableCell>
                          <TableCell sx={headerCellSx}>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {facturas.map((factura) => (
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
                              <Box>
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
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "var(--color-fg-default-secondary)",
                                }}
                              >
                                {formatDate(factura.fechaEmision)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  color: "var(--color-fg-default-primary)",
                                }}
                              >
                                {formatCurrency(factura.montoTotal)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <FacturaGrupoOfertaCell
                                factura={factura}
                                hasBorrador={Boolean(borradores[factura.id])}
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Ver factura">
                                <IconButton
                                  size="small"
                                  onClick={() => handleVerDetalle(factura)}
                                  sx={{
                                    color: "var(--color-fg-default-secondary)",
                                  }}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </TableContainer>

                <Alert
                  severity="info"
                  icon={<InfoOutlined fontSize="inherit" />}
                  sx={{
                    mt: 2,
                    backgroundColor: "var(--color-bg-accent-secondary)",
                    color: "var(--color-fg-default-primary)",
                    "& .MuiAlert-icon": {
                      color: "var(--color-fg-accent-primary)",
                    },
                  }}
                >
                  {grupoBloqueado
                    ? "Ya se envió una oferta en este grupo. No es posible enviar ofertas adicionales."
                    : "Debes completar al menos una oferta en alguna de las facturas para poder enviar la oferta al grupo."}
                </Alert>
              </>
            )}
          </SectionPanel>
      </Box>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          gap: 2,
          px: 3,
          py: 2,
          backgroundColor: "var(--color-bg-default-primary)",
          borderTop: "1px solid var(--color-border-default-primary)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={sendingOfertas}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderColor: "var(--color-fg-default-secondary)",
            color: "var(--color-fg-default-secondary)",
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          startIcon={
            sendingOfertas ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <Send />
            )
          }
          disabled={!canSend || sendingOfertas || grupoBloqueado}
          onClick={handleEnviarOfertaAlGrupo}
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
              color: "var(--color-fg-disabled-primary)",
            },
          }}
        >
          Enviar oferta al grupo
        </Button>
      </Box>

      <FacturaGrupoFactoringDetalleDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        facturaId={detalleFacturaId}
        factoringId={factoringId}
        borrador={
          detalleFacturaId ? borradores[detalleFacturaId] ?? null : null
        }
        onSaveBorrador={handleSaveBorrador}
        onDeleteBorrador={handleDeleteBorrador}
        onOfertaActualizada={() => {
          void loadDetalle();
        }}
        sending={sendingOfertas}
        grupoBloqueado={grupoBloqueado}
        grupoPlazo={grupo?.plazo || 0}
      />

      <Dialog
        open={sendConfirmOpen}
        onClose={() => !sendingOfertas && setSendConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "var(--radius-l)" } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          ¿Enviar oferta al grupo?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Se enviarán {borradoresCount} oferta
            {borradoresCount === 1 ? "" : "s"} borrador
            {borradoresCount === 1 ? "" : "es"} al grupo. Las facturas sin
            borrador no se incluirán.
          </Typography>
          {sendError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {sendError}
              </Typography>
              {sendErrorReason && (
                <Typography variant="body2" sx={{ mt: 0.75 }}>
                  {sendErrorReason}
                </Typography>
              )}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setSendConfirmOpen(false)}
            disabled={sendingOfertas}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              void handleConfirmEnviarOfertaAlGrupo();
            }}
            disabled={sendingOfertas}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "var(--color-fg-on-accent-primary)",
            }}
          >
            {sendingOfertas ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Enviar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={sendSuccessOpen}
        autoHideDuration={4000}
        onClose={() => setSendSuccessOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setSendSuccessOpen(false)}
          sx={{ width: "100%" }}
        >
          Oferta enviada al grupo correctamente.
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default FacturaGrupoFactoringDetalle;
