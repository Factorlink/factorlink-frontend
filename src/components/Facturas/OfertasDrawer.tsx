import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Collapse,
  Button,
} from "@mui/material";
import {
  Close,
  Storefront,
  KeyboardArrowDown,
  KeyboardArrowUp,
  CheckCircle,
  Cancel,
  Comment,
} from "@mui/icons-material";
import { useOfertas } from "../../hooks/useOfertas";
import type { Factura } from "../../types/factura";
import type { Oferta } from "../../types/oferta";
import AceptarOfertaModal from "../Modals/AceptarOfertaModal";
import RechazarOfertaModal from "../Modals/RechazarOfertaModal";
import SortableTableHeader from "./SortableTableHeader";

interface OfertasDrawerProps {
  open: boolean;
  onClose: () => void;
  factura: Factura | null;
}

const formatCurrency = (value: string | number) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "$0";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(numValue);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getEstadoChip = (estado: string) => {
  const normalized = estado?.toLowerCase() || "";
  if (normalized === "activa") {
    return (
      <Chip
        label="Activa"
        size="small"
        sx={{ backgroundColor: "var(--color-bg-success-secondary)", color: "var(--color-fg-success-primary)", fontWeight: 500 }}
      />
    );
  }
  if (normalized === "aceptada") {
    return (
      <Chip
        label="Aceptada"
        size="small"
        sx={{ backgroundColor: "var(--color-bg-success-secondary)", color: "var(--color-fg-success-primary)", fontWeight: 500 }}
      />
    );
  }
  if (normalized === "rechazada") {
    return (
      <Chip
        label="Rechazada"
        size="small"
        sx={{ backgroundColor: "var(--color-bg-danger-secondary)", color: "var(--color-fg-danger-primary)", fontWeight: 500 }}
      />
    );
  }
  if (normalized === "expirada") {
    return (
      <Chip
        icon={<span style={{ fontSize: 14 }}>⚠</span>}
        label="Expirada"
        size="small"
        sx={{ backgroundColor: "var(--color-bg-warning-secondary)", color: "var(--color-fg-warning-primary)", fontWeight: 500 }}
      />
    );
  }
  if (normalized === "inactiva") {
    return (
      <Chip
        label="Inactiva"
        size="small"
        sx={{ backgroundColor: "var(--color-bg-accent-secondary)", color: "var(--color-fg-accent-primary)", fontWeight: 500 }}
      />
    );
  }
  return (
    <Chip
      label="Recibida"
      size="small"
      sx={{ backgroundColor: "var(--color-bg-accent-secondary)", color: "var(--color-fg-accent-primary)", fontWeight: 500 }}
    />
  );
};

const OfertasDrawer = ({ open, onClose, factura }: OfertasDrawerProps) => {
  const { getOfertasByFacturaId, loading } = useOfertas();
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [aceptarModal, setAceptarModal] = useState<{ open: boolean; oferta: Oferta | null }>({ open: false, oferta: null });
  const [rechazarModal, setRechazarModal] = useState<{ open: boolean; oferta: Oferta | null }>({ open: false, oferta: null });
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("ASC");

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(field);
      setSortOrder("ASC");
    }
  };

  const fetchOfertas = async () => {
    if (!factura?.id) return;
    try {
      const params: { orderBy?: string; order?: string } = {};
      if (sortBy) {
        params.orderBy = sortBy;
        params.order = sortOrder;
      }
      const data = await getOfertasByFacturaId(factura.id, params);
      setOfertas(Array.isArray(data) ? data : data?.data || []);
    } catch {
      setOfertas([]);
    }
  };

  useEffect(() => {
    if (open && factura?.id) {
      fetchOfertas();
      setExpandedRow(null);
    } else {
      setOfertas([]);
      setExpandedRow(null);
    }
  }, [open, factura?.id, sortBy, sortOrder]);

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
    window.location.reload();
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { width: { xs: "100%", md: "75%", lg: "65%" }, p: 3 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}>
            Ofertas Recibidas
          </Typography>
          <IconButton onClick={onClose}>
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
                  {formatCurrency(factura.montoTotal)}
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
                  {formatCurrency(factura.montoFinanciar)}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
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

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : ofertas.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="body1" sx={{ color: "var(--color-fg-default-secondary)" }}>
              No hay ofertas para esta factura
            </Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 3, boxShadow: "var(--shadow-card)" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "var(--color-bg-default-tertiary)" }}>
                  <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)", width: 48 }} />
                  <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>
                    Factoring
                  </TableCell>
                  <SortableTableHeader field="porcentajeFinanciamiento" label="% Financiamiento" currentSortBy={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                  <SortableTableHeader field="tasa" label="Tasa" currentSortBy={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                  <SortableTableHeader field="montoAdelanto" label="Monto Adelanto" currentSortBy={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                  <TableCell sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}>
                    Plazo
                  </TableCell>
                  <SortableTableHeader field="fechaExpiracion" label="Fecha Expiración" currentSortBy={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                  <SortableTableHeader field="estado" label="Estado" currentSortBy={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                </TableRow>
              </TableHead>
              <TableBody>
                {ofertas.map((oferta) => {
                  const isNotAvailable = ["expirada", "inactiva"].includes(oferta.estado?.toLowerCase() || "");
                  const isExpanded = expandedRow === oferta.id;
                  const isRespondida =
                    oferta.estado?.toLowerCase() === "aceptada" ||
                    oferta.estado?.toLowerCase() === "rechazada";

                  return (
                    <>
                      <TableRow
                        key={oferta.id}
                        sx={{
                          opacity: isNotAvailable ? 0.5 : 1,
                          "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
                          cursor: isNotAvailable ? "default" : "pointer",
                          "& > td": { borderBottom: isExpanded ? 0 : undefined },
                        }}
                        onClick={() => !isNotAvailable && handleToggleRow(oferta.id)}
                      >
                        <TableCell sx={{ width: 48, px: 1 }}>
                          {!isNotAvailable && (
                            <IconButton size="small">
                              {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
                            >
                              {oferta.factoring?.razonSocial || "N/A"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                              {oferta.factoring?.rut || ""}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: "var(--color-fg-success-primary)", fontWeight: 600 }}
                          >
                            {parseFloat(
                              oferta.porcentajeFinanciamiento || "0",
                            ).toFixed(2)}
                            %
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: "var(--color-fg-default-primary)", fontWeight: 500 }}
                          >
                            {parseFloat(oferta.tasa || "0").toFixed(2)}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: "var(--color-fg-success-primary)", fontWeight: 600 }}
                          >
                            {formatCurrency(oferta.montoAdelanto)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${factura?.plazo || 0} días`}
                            size="small"
                            sx={{
                              backgroundColor: "var(--color-bg-default-tertiary)",
                              color: "var(--color-fg-default-primary)",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: isNotAvailable ? "var(--color-fg-danger-primary)" : "var(--color-fg-default-secondary)" }}
                          >
                            {formatDate(oferta.fechaExpiracion)}
                          </Typography>
                        </TableCell>
                        <TableCell>{getEstadoChip(oferta.estado)}</TableCell>
                      </TableRow>

                      {/* Expandable row */}
                      <TableRow key={`${oferta.id}-expand`}>
                        <TableCell colSpan={8} sx={{ py: 0, px: 0 }}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box
                              sx={{
                                p: 2.5,
                                pl: 7,
                                backgroundColor: "var(--color-bg-default-tertiary)",
                                borderBottom: "1px solid var(--color-border-default-primary)",
                              }}
                            >
                              {/* Comentario */}
                              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}>
                                <Comment sx={{ fontSize: 18, color: "var(--color-fg-default-secondary)", mt: 0.3 }} />
                                <Box>
                                  <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)", fontWeight: 600 }}>
                                    Comentario del factoring
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: "var(--color-fg-default-primary)", mt: 0.5 }}>
                                    {oferta.comentario || "Sin comentario"}
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Action buttons */}
                              {!isRespondida && !isNotAvailable && !aceptadas && (
                                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                                  <Button
                                    variant="contained"
                                    startIcon={<CheckCircle />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAceptarModal({ open: true, oferta });
                                    }}
                                    sx={{
                                      backgroundColor: "var(--color-bg-success-primary)",
                                      color: "var(--color-fg-on-accent-primary)",
                                      textTransform: "none",
                                      fontWeight: 600,
                                      borderRadius: 2,
                                      px: 3,
                                      py: 1,
                                      "&:hover": { backgroundColor: "var(--color-bg-success-primary-hover)" },
                                    }}
                                  >
                                    Aceptar oferta
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    startIcon={<Cancel />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRechazarModal({ open: true, oferta });
                                    }}
                                    sx={{
                                      borderColor: "var(--color-fg-danger-primary)",
                                      color: "var(--color-fg-danger-primary)",
                                      textTransform: "none",
                                      fontWeight: 600,
                                      borderRadius: 2,
                                      px: 3,
                                      py: 1,
                                      "&:hover": {
                                        borderColor: "var(--color-border-danger-secondary)",
                                        backgroundColor: "var(--color-bg-danger-secondary)",
                                      },
                                    }}
                                  >
                                    Rechazar oferta
                                  </Button>
                                </Box>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
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
          }}
        />
      )}
    </>
  );
};

export default OfertasDrawer;
