import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { useOfertas } from "../../hooks/useOfertas";
import type { Factura } from "../../types/factura";
import type { Oferta } from "../../types/oferta";
import AceptarOfertaModal from "../Modals/AceptarOfertaModal";
import RechazarOfertaModal from "../Modals/RechazarOfertaModal";
import OfertaRecibidaCard from "../Ofertas/OfertaRecibidaCard";
import {
  isOfertaCondicionada,
  puedeComentar as puedeComentarOferta,
} from "../../utils/ofertaEstados";

const SORT_OPTIONS = [
  { value: "", label: "Sin orden" },
  { value: "porcentajeFinanciamiento", label: "% Financiamiento" },
  { value: "tasa30Dias", label: "Tasa 30 días" },
  { value: "montoAFinanciar", label: "Monto a financiar" },
  { value: "fechaExpiracion", label: "Fecha expiración" },
  { value: "estado", label: "Estado" },
] as const;

const ESTADOS_NO_DISPONIBLES = ["expirada", "inactiva"];
const ESTADOS_RESPONDIDOS = ["aceptada", "rechazada"];

export type FacturaOfertasListProps = {
  factura: Factura;
  /** When false, clears list and skips fetch. */
  enabled?: boolean;
  initialOfertaId?: string | null;
  selectedOfertaId?: string | null;
  onSelectOferta?: (ofertaId: string | null) => void;
  onOfertasActualizadas?: () => void;
  onOfertasLoaded?: (ofertas: Oferta[]) => void;
};

const FacturaOfertasList = ({
  factura,
  enabled = true,
  initialOfertaId = null,
  selectedOfertaId = null,
  onSelectOferta,
  onOfertasActualizadas,
  onOfertasLoaded,
}: FacturaOfertasListProps) => {
  const { getOfertasByFacturaId, comentarEmpresa, loading } = useOfertas();
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [errorOfertas, setErrorOfertas] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [aceptarModal, setAceptarModal] = useState<{
    open: boolean;
    oferta: Oferta | null;
  }>({ open: false, oferta: null });
  const [rechazarModal, setRechazarModal] = useState<{
    open: boolean;
    oferta: Oferta | null;
  }>({ open: false, oferta: null });
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("ASC");
  const appliedInitialOfertaIdRef = useRef<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const fetchOfertas = async () => {
    if (!factura?.id) return;
    try {
      setErrorOfertas(null);
      const params: { orderBy?: string; order?: string } = {};
      if (sortBy) {
        params.orderBy = sortBy;
        params.order = sortOrder;
      }
      const data = await getOfertasByFacturaId(factura.id, params);
      const list: Oferta[] = Array.isArray(data) ? data : data?.data || [];
      setOfertas(list);
      onOfertasLoaded?.(list);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setOfertas([]);
      onOfertasLoaded?.([]);
      setErrorOfertas(
        axiosError?.response?.data?.message ||
          "No se pudieron cargar las ofertas de esta factura.",
      );
    }
  };

  useEffect(() => {
    if (enabled && factura?.id) {
      void fetchOfertas();
    } else {
      setOfertas([]);
      setExpandedRow(null);
      appliedInitialOfertaIdRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, factura?.id, sortBy, sortOrder]);

  useEffect(() => {
    if (!enabled) {
      appliedInitialOfertaIdRef.current = null;
      return;
    }
    if (
      !initialOfertaId ||
      appliedInitialOfertaIdRef.current === initialOfertaId
    ) {
      return;
    }
    const target = ofertas.find((oferta) => oferta.id === initialOfertaId);
    if (!target) return;
    appliedInitialOfertaIdRef.current = initialOfertaId;
    const isNotAvailable = ESTADOS_NO_DISPONIBLES.includes(
      target.estado?.toLowerCase() || "",
    );
    if (!isNotAvailable) {
      setExpandedRow(initialOfertaId);
      onSelectOferta?.(initialOfertaId);
    }
  }, [enabled, initialOfertaId, ofertas, onSelectOferta]);

  useEffect(() => {
    if (!enabled || !expandedRow) return;
    if (appliedInitialOfertaIdRef.current !== expandedRow) return;
    const card = cardRefs.current[expandedRow];
    if (!card) return;
    const frame = requestAnimationFrame(() => {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [enabled, expandedRow]);

  useEffect(() => {
    if (!enabled || !selectedOfertaId) return;
    if (expandedRow === selectedOfertaId) return;
    if (ofertas.some((o) => o.id === selectedOfertaId)) {
      setExpandedRow(selectedOfertaId);
    }
  }, [enabled, selectedOfertaId, ofertas, expandedRow]);

  const activas = ofertas.filter(
    (o) => o.estado?.toLowerCase() === "activa",
  ).length;

  const aceptadas = ofertas.filter(
    (o) => o.estado?.toLowerCase() === "aceptada",
  ).length;

  const handleToggleRow = (ofertaId: string) => {
    setExpandedRow((prev) => {
      const next = prev === ofertaId ? null : ofertaId;
      onSelectOferta?.(next);
      return next;
    });
  };

  const handleAceptarSuccess = () => {
    navigate("/facturas/cedidas");
  };

  const handleRechazarSuccess = () => {
    void fetchOfertas();
    onOfertasActualizadas?.();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 2,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}
          >
            Ofertas disponibles
          </Typography>
          <Chip
            label={`${activas} activas`}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            select
            size="small"
            label="Ordenar por"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ minWidth: 190 }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Tooltip
            title={sortOrder === "ASC" ? "Ascendente" : "Descendente"}
            arrow
          >
            <IconButton
              onClick={() =>
                setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"))
              }
              disabled={!sortBy}
              size="small"
            >
              {sortOrder === "ASC" ? <ArrowUpward /> : <ArrowDownward />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : errorOfertas ? (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                void fetchOfertas();
              }}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Reintentar
            </Button>
          }
        >
          {errorOfertas}
        </Alert>
      ) : ofertas.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography
            variant="body1"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            No hay ofertas para esta factura
          </Typography>
        </Box>
      ) : (
        <Box sx={{ pr: 0.5 }}>
          {ofertas.map((oferta) => {
            const estado = oferta.estado?.toLowerCase() || "";
            const disponible = !ESTADOS_NO_DISPONIBLES.includes(estado);
            const respondida = ESTADOS_RESPONDIDOS.includes(estado);

            return (
              <OfertaRecibidaCard
                key={oferta.id}
                oferta={oferta}
                plazo={factura.plazo || 0}
                expandida={expandedRow === oferta.id}
                disponible={disponible}
                mostrarAcciones={disponible && !respondida && !aceptadas}
                puedeComentar={
                  puedeComentarOferta(oferta) && isOfertaCondicionada(oferta)
                }
                onToggle={() => handleToggleRow(oferta.id)}
                onAceptar={() => setAceptarModal({ open: true, oferta })}
                onRechazar={() => setRechazarModal({ open: true, oferta })}
                onEnviarComentario={async (texto) => {
                  await comentarEmpresa(oferta.id, texto);
                }}
                cardRef={(el) => {
                  cardRefs.current[oferta.id] = el;
                }}
              />
            );
          })}
        </Box>
      )}

      {aceptarModal.oferta && (
        <AceptarOfertaModal
          open={aceptarModal.open}
          onClose={() => setAceptarModal({ open: false, oferta: null })}
          onSuccess={handleAceptarSuccess}
          ofertaData={{
            id: aceptarModal.oferta.id,
            factoringName: aceptarModal.oferta.factoring?.razonSocial || "N/A",
            montoAFinanciar: aceptarModal.oferta.montoAFinanciar,
            tasa30Dias: aceptarModal.oferta.tasa30Dias,
            porcentajeFinanciamiento:
              aceptarModal.oferta.porcentajeFinanciamiento,
            montoAGirar: aceptarModal.oferta.montoAGirar,
            retencion: aceptarModal.oferta.retencion,
          }}
        />
      )}
      {rechazarModal.oferta && (
        <RechazarOfertaModal
          open={rechazarModal.open}
          onClose={() => setRechazarModal({ open: false, oferta: null })}
          onSuccess={handleRechazarSuccess}
          ofertaData={{
            id: rechazarModal.oferta.id,
            factoringName: rechazarModal.oferta.factoring?.razonSocial || "N/A",
            montoAFinanciar: rechazarModal.oferta.montoAFinanciar,
            tasa30Dias: rechazarModal.oferta.tasa30Dias,
            porcentajeFinanciamiento:
              rechazarModal.oferta.porcentajeFinanciamiento,
            montoAGirar: rechazarModal.oferta.montoAGirar,
            retencion: rechazarModal.oferta.retencion,
            ofertaCondicionada: isOfertaCondicionada(rechazarModal.oferta),
          }}
        />
      )}
    </>
  );
};

export default FacturaOfertasList;
