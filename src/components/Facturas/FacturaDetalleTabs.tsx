import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  ChatBubbleOutline,
  InfoOutlined,
  RequestQuote,
} from "@mui/icons-material";
import type { Factura } from "../../types/factura";
import type { Oferta } from "../../types/oferta";
import { useOfertas } from "../../hooks/useOfertas";
import {
  isOfertaCondicionada,
  puedeComentar as puedeComentarOferta,
} from "../../utils/ofertaEstados";
import ConversacionOferta from "../Ofertas/ConversacionOferta";
import FacturaDetalleInformacion from "./FacturaDetalleInformacion";
import FacturaOfertasList from "./FacturaOfertasList";

export type FacturaDetalleTab = "informacion" | "ofertas" | "comentarios";

export type FacturaDetalleTabsProps = {
  factura: Factura;
  onFacturaChange: (factura: Factura) => void;
  activeTab?: FacturaDetalleTab;
  defaultTab?: FacturaDetalleTab;
  onTabChange?: (tab: FacturaDetalleTab) => void;
  selectedOfertaId?: string | null;
  onSelectOferta?: (id: string | null) => void;
  initialOfertaId?: string | null;
  onOfertasActualizadas?: () => void;
  /** When false, skip prefetch / ofertas list fetch (e.g. drawer closed). */
  enabled?: boolean;
  dense?: boolean;
  includeDocumentos?: boolean;
  /** Extra content in the Información tab (e.g. Acciones column). */
  informacionExtra?: ReactNode;
  comentariosSelectLabelId?: string;
};

const TabPanel = ({
  value,
  current,
  children,
}: {
  value: FacturaDetalleTab;
  current: FacturaDetalleTab;
  children: ReactNode;
}) => {
  if (value !== current) return null;
  return <Box sx={{ pt: 2 }}>{children}</Box>;
};

export const pickDefaultOfertaId = (ofertas: Oferta[]) => {
  if (ofertas.length === 0) return null;
  const comentable = ofertas.find(
    (o) => puedeComentarOferta(o) && isOfertaCondicionada(o),
  );
  if (comentable) return comentable.id;
  const activa = ofertas.find((o) => o.estado?.toLowerCase() === "activa");
  return activa?.id ?? ofertas[0]?.id ?? null;
};

const FacturaDetalleTabs = ({
  factura,
  onFacturaChange,
  activeTab: activeTabProp,
  defaultTab = "informacion",
  onTabChange,
  selectedOfertaId: selectedOfertaIdProp,
  onSelectOferta,
  initialOfertaId = null,
  onOfertasActualizadas,
  enabled = true,
  dense = false,
  includeDocumentos = true,
  informacionExtra,
  comentariosSelectLabelId = "factura-detalle-oferta-comentarios-label",
}: FacturaDetalleTabsProps) => {
  const { getOfertasByFacturaId, comentarEmpresa } = useOfertas();
  const [internalTab, setInternalTab] =
    useState<FacturaDetalleTab>(defaultTab);
  const [internalSelectedOfertaId, setInternalSelectedOfertaId] = useState<
    string | null
  >(null);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);

  const isControlledTab = activeTabProp !== undefined;
  const tab = isControlledTab ? activeTabProp : internalTab;

  const isControlledOferta = selectedOfertaIdProp !== undefined;
  const selectedOfertaId = isControlledOferta
    ? selectedOfertaIdProp
    : internalSelectedOfertaId;

  const isCargada = factura.estado?.toLowerCase() === "cargada";
  const showOfertasTabs = !isCargada;

  const setTab = (next: FacturaDetalleTab) => {
    if (!isControlledTab) setInternalTab(next);
    onTabChange?.(next);
  };

  const setSelectedOfertaId = (id: string | null) => {
    if (!isControlledOferta) setInternalSelectedOfertaId(id);
    onSelectOferta?.(id);
  };

  const resolveSelectedOfertaId = useCallback(
    (list: Oferta[], current: string | null) => {
      if (current && list.some((oferta) => oferta.id === current)) {
        return current;
      }
      if (
        initialOfertaId &&
        list.some((oferta) => oferta.id === initialOfertaId)
      ) {
        return initialOfertaId;
      }
      return pickDefaultOfertaId(list);
    },
    [initialOfertaId],
  );

  const prefetchOfertas = useCallback(
    async (id: string, currentSelected: string | null) => {
      try {
        const data = await getOfertasByFacturaId(id);
        const list: Oferta[] = Array.isArray(data) ? data : data?.data || [];
        setOfertas(list);
        const nextId = resolveSelectedOfertaId(list, currentSelected);
        if (!isControlledOferta) setInternalSelectedOfertaId(nextId);
        onSelectOferta?.(nextId);
      } catch (err) {
        console.error("Error prefetching ofertas:", err);
        setOfertas([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolveSelectedOfertaId, isControlledOferta, onSelectOferta],
  );

  useEffect(() => {
    if (!enabled || isCargada) {
      if (!enabled) {
        setOfertas([]);
        if (!isControlledOferta) setInternalSelectedOfertaId(null);
      }
      return;
    }
    void prefetchOfertas(factura.id, selectedOfertaId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, factura.id, isCargada, prefetchOfertas]);

  useEffect(() => {
    if (!showOfertasTabs && tab !== "informacion") {
      setTab("informacion");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOfertasTabs, tab]);

  useEffect(() => {
    if (!isControlledTab) {
      setInternalTab(defaultTab);
    }
  }, [defaultTab, isControlledTab, factura.id]);

  const selectedOferta = useMemo(
    () => ofertas.find((o) => o.id === selectedOfertaId) ?? null,
    [ofertas, selectedOfertaId],
  );

  const handleOfertasLoaded = (list: Oferta[]) => {
    setOfertas(list);
    const current = selectedOfertaId;
    if (current && list.some((o) => o.id === current)) return;
    if (
      initialOfertaId &&
      list.some((oferta) => oferta.id === initialOfertaId)
    ) {
      setSelectedOfertaId(initialOfertaId);
      return;
    }
    setSelectedOfertaId(pickDefaultOfertaId(list));
  };

  const handleOfertasActualizadas = () => {
    onOfertasActualizadas?.();
    if (enabled && !isCargada) {
      void prefetchOfertas(factura.id, selectedOfertaId);
    }
  };

  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Tabs
          value={showOfertasTabs || tab === "informacion" ? tab : "informacion"}
          onChange={(_e, value: FacturaDetalleTab) => setTab(value)}
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
            onFacturaChange={onFacturaChange}
            dense={dense}
            includeDocumentos={includeDocumentos}
          />
          {informacionExtra}
        </TabPanel>

        {showOfertasTabs && (
          <TabPanel value="ofertas" current={tab}>
            <FacturaOfertasList
              factura={factura}
              enabled={enabled && tab === "ofertas"}
              initialOfertaId={initialOfertaId}
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
                  <InputLabel id={comentariosSelectLabelId}>Oferta</InputLabel>
                  <Select
                    labelId={comentariosSelectLabelId}
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
                    onEnviarComentario={async (texto, archivos) => {
                      await comentarEmpresa(
                        selectedOferta.id,
                        texto,
                        archivos,
                      );
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
  );
};

export default FacturaDetalleTabs;
