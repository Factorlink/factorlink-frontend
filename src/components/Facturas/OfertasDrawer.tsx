import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Close,
  Storefront,
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";
import { useOfertas } from "../../hooks/useOfertas";
import type { Factura } from "../../types/factura";
import type { Oferta } from "../../types/oferta";
import AceptarOfertaModal from "../Modals/AceptarOfertaModal";
import RechazarOfertaModal from "../Modals/RechazarOfertaModal";
import OfertaRecibidaCard from "../Ofertas/OfertaRecibidaCard";
import { formatMoney } from "../../utils/ofertaFormatters";
import {
  isOfertaCondicionada,
  puedeComentar as puedeComentarOferta,
} from "../../utils/ofertaEstados";

interface OfertasDrawerProps {
  open: boolean;
  onClose: () => void;
  factura: Factura | null;
  initialOfertaId?: string | null;
  onOfertasActualizadas?: () => void;
}

const SORT_OPTIONS = [
  { value: "", label: "Sin orden" },
  { value: "porcentajeFinanciamiento", label: "% Financiamiento" },
  { value: "tasa", label: "Tasa" },
  { value: "montoAdelanto", label: "Monto adelanto" },
  { value: "fechaExpiracion", label: "Fecha expiración" },
  { value: "estado", label: "Estado" },
] as const;

const ESTADOS_NO_DISPONIBLES = ["expirada", "inactiva"];
const ESTADOS_RESPONDIDOS = ["aceptada", "rechazada"];

const OfertasDrawer = ({
  open,
  onClose,
  factura,
  initialOfertaId,
  onOfertasActualizadas,
}: OfertasDrawerProps) => {
  const { getOfertasByFacturaId, comentarEmpresa, loading } = useOfertas();
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [errorOfertas, setErrorOfertas] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [aceptarModal, setAceptarModal] = useState<{ open: boolean; oferta: Oferta | null }>({ open: false, oferta: null });
  const [rechazarModal, setRechazarModal] = useState<{ open: boolean; oferta: Oferta | null }>({ open: false, oferta: null });
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
      setOfertas(Array.isArray(data) ? data : data?.data || []);
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setOfertas([]);
      setErrorOfertas(
        axiosError?.response?.data?.message ||
          "No se pudieron cargar las ofertas de esta factura.",
      );
    }
  };

  useEffect(() => {
    if (open && factura?.id) {
      fetchOfertas();
    } else {
      setOfertas([]);
      setExpandedRow(null);
    }
  }, [open, factura?.id, sortBy, sortOrder]);

  useEffect(() => {
    if (!open) {
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
    }
  }, [open, initialOfertaId, ofertas]);

  useEffect(() => {
    if (!open || !expandedRow) return;
    if (appliedInitialOfertaIdRef.current !== expandedRow) return;
    const card = cardRefs.current[expandedRow];
    if (!card) return;
    const frame = requestAnimationFrame(() => {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, expandedRow]);

  const activas = ofertas.filter(
    (o) => o.estado?.toLowerCase() === "activa"
  ).length;

  const aceptadas = ofertas.filter(
    (o) => o.estado?.toLowerCase() === "aceptada"
  ).length;

  const handleToggleRow = (ofertaId: string) => {
    setExpandedRow((prev) => (prev === ofertaId ? null : ofertaId));
  };

  const handleAceptarSuccess = () => {
    navigate("/facturas/cedidas");
  };

  const handleRechazarSuccess = () => {
    fetchOfertas();
    onOfertasActualizadas?.();
  };

  return (
    <>
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
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 3,
            flexShrink: 0,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "var(--color-fg-default-primary)",
              minWidth: 0,
            }}
          >
            Ofertas Recibidas
          </Typography>
          <IconButton onClick={onClose} sx={{ flexShrink: 0 }}>
            <Close />
          </IconButton>
        </Box>

        {/* Referencia de Factura */}
        {factura && (
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              mb: 3,
              boxShadow: "var(--shadow-card)",
              flexShrink: 0,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)", mb: 1.5 }}
            >
              Referencia de Factura
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                  Folio:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--color-fg-accent-primary)", fontWeight: 600 }}
                >
                  #{factura.folio}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                  Receptor:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
                >
                  {factura.razonSocialReceptor || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                  Monto Total:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}
                >
                  {formatMoney(factura.montoTotal)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                  Monto a Financiar:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: "var(--color-fg-success-primary)" }}
                >
                  {formatMoney(factura.montoFinanciar)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                  Estado:
                </Typography>
                <Chip
                  icon={<Storefront sx={{ fontSize: 14 }} />}
                  label="EN MARKETPLACE"
                  size="small"
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    borderColor: "var(--color-fg-default-primary)",
                    color: "var(--color-fg-default-primary)",
                  }}
                />
              </Box>
            </Box>
          </Paper>
        )}

        {/* Ofertas disponibles */}
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
                onClick={fetchOfertas}
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
            <Typography variant="body1" sx={{ color: "var(--color-fg-default-secondary)" }}>
              No hay ofertas para esta factura
            </Typography>
          </Box>
        ) : (
          <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: 0.5 }}>
            {ofertas.map((oferta) => {
              const estado = oferta.estado?.toLowerCase() || "";
              const disponible = !ESTADOS_NO_DISPONIBLES.includes(estado);
              const respondida = ESTADOS_RESPONDIDOS.includes(estado);

              return (
                <OfertaRecibidaCard
                  key={oferta.id}
                  oferta={oferta}
                  plazo={factura?.plazo || 0}
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
      </Drawer>

      {/* Modals */}
      {aceptarModal.oferta && (
        <AceptarOfertaModal
          open={aceptarModal.open}
          onClose={() => setAceptarModal({ open: false, oferta: null })}
          onSuccess={handleAceptarSuccess}
          ofertaData={{
            id: aceptarModal.oferta.id,
            factoringName: aceptarModal.oferta.factoring?.razonSocial || "N/A",
            montoAdelanto: aceptarModal.oferta.montoAdelanto,
            tasa: aceptarModal.oferta.tasa,
            porcentajeFinanciamiento: aceptarModal.oferta.porcentajeFinanciamiento,
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
            montoAdelanto: rechazarModal.oferta.montoAdelanto,
            tasa: rechazarModal.oferta.tasa,
            porcentajeFinanciamiento: rechazarModal.oferta.porcentajeFinanciamiento,
            montoAGirar: rechazarModal.oferta.montoAGirar,
            retencion: rechazarModal.oferta.retencion,
            ofertaCondicionada: isOfertaCondicionada(rechazarModal.oferta),
          }}
        />
      )}
    </>
  );
};

export default OfertasDrawer;
