import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  ChatBubbleOutline,
  Close,
  Description,
  ErrorOutline,
  InfoOutlined,
  RequestQuote,
} from "@mui/icons-material";
import type { Factura } from "../../types/factura";
import type { Oferta } from "../../types/oferta";
import { useFacturas } from "../../hooks/useFacturas";
import { useOfertas } from "../../hooks/useOfertas";
import { getFacturaStatusConfig } from "../../theme";
import {
  isOfertaCondicionada,
  puedeComentar as puedeComentarOferta,
} from "../../utils/ofertaEstados";
import ConversacionOferta from "../Ofertas/ConversacionOferta";
import FacturaDetalleInformacion from "./FacturaDetalleInformacion";
import FacturaOfertasList from "./FacturaOfertasList";

export type FacturaDetalleDrawerProps = {
  open: boolean;
  onClose: () => void;
  facturaId: string | null;
  onDeleted?: () => void;
  onFacturaUpdated?: () => void;
};

type DrawerTab = "informacion" | "ofertas" | "comentarios";

const TabPanel = ({
  value,
  current,
  children,
}: {
  value: DrawerTab;
  current: DrawerTab;
  children: ReactNode;
}) => {
  if (value !== current) return null;
  return <Box sx={{ pt: 2 }}>{children}</Box>;
};

const pickDefaultOfertaId = (ofertas: Oferta[]) => {
  if (ofertas.length === 0) return null;
  const comentable = ofertas.find(
    (o) => puedeComentarOferta(o) && isOfertaCondicionada(o),
  );
  if (comentable) return comentable.id;
  const activa = ofertas.find((o) => o.estado?.toLowerCase() === "activa");
  return activa?.id ?? ofertas[0]?.id ?? null;
};

const FacturaDetalleDrawer = ({
  open,
  onClose,
  facturaId,
  onFacturaUpdated,
}: FacturaDetalleDrawerProps) => {
  const { getFacturaById } = useFacturas();
  const { getOfertasByFacturaId, comentarEmpresa } = useOfertas();
  const [factura, setFactura] = useState<Factura | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<DrawerTab>("informacion");
  const [selectedOfertaId, setSelectedOfertaId] = useState<string | null>(null);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);

  const loadFactura = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFacturaById(id);
      setFactura(data);
    } catch (err) {
      console.error("Error loading factura in drawer:", err);
      setFactura(null);
      setError("No se pudo cargar la factura. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open || !facturaId) {
      setFactura(null);
      setError(null);
      setLoading(false);
      setTab("informacion");
      setSelectedOfertaId(null);
      setOfertas([]);
      return;
    }
    void loadFactura(facturaId);
  }, [open, facturaId, loadFactura]);

  const isCargada = factura?.estado?.toLowerCase() === "cargada";
  const showOfertasTabs = Boolean(factura && !isCargada);
  const statusConfig = getFacturaStatusConfig(factura?.estado || "");

  const prefetchOfertas = useCallback(async (id: string) => {
    try {
      const data = await getOfertasByFacturaId(id);
      const list: Oferta[] = Array.isArray(data) ? data : data?.data || [];
      setOfertas(list);
      setSelectedOfertaId((prev) => {
        if (prev && list.some((oferta) => oferta.id === prev)) return prev;
        return pickDefaultOfertaId(list);
      });
    } catch (err) {
      console.error("Error prefetching ofertas in drawer:", err);
      setOfertas([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open || !factura || isCargada) {
      if (!open) {
        setOfertas([]);
        setSelectedOfertaId(null);
      }
      return;
    }
    void prefetchOfertas(factura.id);
  }, [open, factura, isCargada, prefetchOfertas]);

  useEffect(() => {
    if (!showOfertasTabs && tab !== "informacion") {
      setTab("informacion");
    }
  }, [showOfertasTabs, tab]);

  const selectedOferta = useMemo(
    () => ofertas.find((o) => o.id === selectedOfertaId) ?? null,
    [ofertas, selectedOfertaId],
  );

  const handleFacturaChange = (next: Factura) => {
    setFactura(next);
  };

  const handleOfertasLoaded = (list: Oferta[]) => {
    setOfertas(list);
    setSelectedOfertaId((prev) => {
      if (prev && list.some((o) => o.id === prev)) return prev;
      return pickDefaultOfertaId(list);
    });
  };

  const handleOfertasActualizadas = () => {
    onFacturaUpdated?.();
    if (facturaId) {
      void loadFactura(facturaId);
      void prefetchOfertas(facturaId);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", md: "75%", lg: "65%" },
          p: { xs: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          mb: 1,
          flexShrink: 0,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "var(--color-fg-default-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {factura?.folio
              ? `Detalle de la factura #${factura.folio}`
              : "Detalle de la factura"}
          </Typography>
          {factura?.razonSocialReceptor && (
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-default-secondary)" }}
            >
              {factura.razonSocialReceptor}
            </Typography>
          )}
          {factura?.estado && (
            <Chip
              icon={statusConfig.icon as React.ReactElement}
              label={statusConfig.label}
              size="small"
              sx={{
                mt: 1,
                backgroundColor: statusConfig.bgColor,
                color: statusConfig.color,
                fontWeight: 500,
                "& .MuiChip-icon": { color: statusConfig.color },
              }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar" size="small">
          <Close />
        </IconButton>
      </Box>

      {loading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: "var(--color-fg-accent-primary)" }} />
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            Cargando factura...
          </Typography>
        </Box>
      )}

      {!loading && error && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 2,
            textAlign: "center",
          }}
        >
          <ErrorOutline
            sx={{ fontSize: 48, color: "var(--color-fg-danger-primary)" }}
          />
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            {error}
          </Typography>
          {facturaId && (
            <Button
              variant="contained"
              onClick={() => void loadFactura(facturaId)}
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
              Reintentar
            </Button>
          )}
        </Box>
      )}

      {!loading && !error && !factura && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 1,
          }}
        >
          <Description
            sx={{ fontSize: 48, color: "var(--color-fg-default-tertiary)" }}
          />
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            Factura no encontrada
          </Typography>
        </Box>
      )}

      {!loading && !error && factura && (
        <>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              flexShrink: 0,
            }}
          >
            <Tabs
              value={tab}
              onChange={(_e, value: DrawerTab) => setTab(value)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab
                value="informacion"
                icon={<InfoOutlined sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Información"
                sx={{ textTransform: "none", minHeight: 48 }}
              />
              {showOfertasTabs && (
                <Tab
                  value="ofertas"
                  icon={<RequestQuote sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  label="Ofertas"
                  sx={{ textTransform: "none", minHeight: 48 }}
                />
              )}
              {showOfertasTabs && (
                <Tab
                  value="comentarios"
                  icon={<ChatBubbleOutline sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  label="Comentarios"
                  sx={{ textTransform: "none", minHeight: 48 }}
                />
              )}
            </Tabs>
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              pr: 0.5,
            }}
          >
            <TabPanel value="informacion" current={tab}>
              <FacturaDetalleInformacion
                factura={factura}
                onFacturaChange={handleFacturaChange}
                dense
                includeDocumentos
              />
            </TabPanel>

            {showOfertasTabs && (
              <TabPanel value="ofertas" current={tab}>
                <FacturaOfertasList
                  factura={factura}
                  enabled={open && tab === "ofertas"}
                  selectedOfertaId={selectedOfertaId}
                  onSelectOferta={setSelectedOfertaId}
                  onOfertasLoaded={handleOfertasLoaded}
                  onOfertasActualizadas={handleOfertasActualizadas}
                />
              </TabPanel>
            )}

            {showOfertasTabs && (
              <TabPanel value="comentarios" current={tab}>
                {ofertas.length === 0 ? (
                  <Box sx={{ py: 4, textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "var(--color-fg-default-secondary)",
                        mb: 2,
                      }}
                    >
                      No hay ofertas para comentar. Revisá la pestaña Ofertas.
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => setTab("ofertas")}
                      sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                      Ir a Ofertas
                    </Button>
                  </Box>
                ) : (
                  <>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                      <InputLabel id="drawer-oferta-comentarios-label">
                        Oferta
                      </InputLabel>
                      <Select
                        labelId="drawer-oferta-comentarios-label"
                        label="Oferta"
                        value={selectedOfertaId || ""}
                        onChange={(e) =>
                          setSelectedOfertaId(e.target.value || null)
                        }
                      >
                        {ofertas.map((oferta) => (
                          <MenuItem key={oferta.id} value={oferta.id}>
                            {oferta.factoring?.razonSocial || "Factoring"} ·{" "}
                            {oferta.estado}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {selectedOferta ? (
                      <ConversacionOferta
                        ofertaId={selectedOferta.id}
                        ladoActual="EMPRESA"
                        puedeComentar={
                          puedeComentarOferta(selectedOferta) &&
                          isOfertaCondicionada(selectedOferta)
                        }
                        onEnviarComentario={async (texto) => {
                          await comentarEmpresa(selectedOferta.id, texto);
                        }}
                      />
                    ) : (
                      <Alert severity="info">
                        Seleccioná una oferta para ver los comentarios.
                      </Alert>
                    )}
                  </>
                )}
              </TabPanel>
            )}
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default FacturaDetalleDrawer;
