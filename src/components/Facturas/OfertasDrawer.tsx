import { useEffect, useState } from "react";
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
        sx={{ backgroundColor: "#D1FAE5", color: "#065F46", fontWeight: 500 }}
      />
    );
  }
  if (normalized === "aceptada") {
    return (
      <Chip
        label="Aceptada"
        size="small"
        sx={{ backgroundColor: "#D1FAE5", color: "#065F46", fontWeight: 500 }}
      />
    );
  }
  if (normalized === "rechazada") {
    return (
      <Chip
        label="Rechazada"
        size="small"
        sx={{ backgroundColor: "#FEE2E2", color: "#991B1B", fontWeight: 500 }}
      />
    );
  }
  if (normalized === "expirada") {
    return (
      <Chip
        icon={<span style={{ fontSize: 14 }}>⚠</span>}
        label="Expirada"
        size="small"
        sx={{ backgroundColor: "#FEF3C7", color: "#92400E", fontWeight: 500 }}
      />
    );
  }
  return (
    <Chip
      label="Recibida"
      size="small"
      sx={{ backgroundColor: "#E0F2FE", color: "#0369A1", fontWeight: 500 }}
    />
  );
};

const OfertasDrawer = ({ open, onClose, factura }: OfertasDrawerProps) => {
  const { getOfertasByFacturaId, loading } = useOfertas();
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [aceptarModal, setAceptarModal] = useState<{ open: boolean; oferta: Oferta | null }>({ open: false, oferta: null });
  const [rechazarModal, setRechazarModal] = useState<{ open: boolean; oferta: Oferta | null }>({ open: false, oferta: null });

  const fetchOfertas = async () => {
    if (!factura?.id) return;
    try {
      const data = await getOfertasByFacturaId(factura.id);
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
  }, [open, factura?.id]);

  const activas = ofertas.filter(
    (o) =>
      o.estado?.toLowerCase() !== "expirada" &&
      o.estado?.toLowerCase() !== "rechazada",
  ).length;

  const handleToggleRow = (ofertaId: string) => {
    setExpandedRow((prev) => (prev === ofertaId ? null : ofertaId));
  };

  const handleModalSuccess = () => {
    fetchOfertas();
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
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1E293B" }}>
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
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "#1E293B", mb: 1.5 }}
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
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Folio:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#00BCD4", fontWeight: 600 }}
                >
                  #{factura.folio}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Receptor:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#1E293B" }}
                >
                  {factura.razonSocialReceptor || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Monto Total:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: "#1E293B" }}
                >
                  {formatCurrency(factura.montoTotal)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Monto a Financiar:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: "#00A86B" }}
                >
                  {formatCurrency(factura.montoFinanciar)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Estado:
                </Typography>
                <Chip
                  icon={<Storefront sx={{ fontSize: 14 }} />}
                  label="EN MARKETPLACE"
                  size="small"
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    borderColor: "#334155",
                    color: "#334155",
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
            sx={{ fontWeight: 700, color: "#1E293B" }}
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
            <Typography variant="body1" sx={{ color: "#64748B" }}>
              No hay ofertas para esta factura
            </Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#64748B", width: 48 }} />
                  <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                    Factoring
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                    % Financiamiento
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                    Tasa
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                    Monto Adelanto
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                    Plazo
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                    Fecha Expiración
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                    Estado
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ofertas.map((oferta) => {
                  const isExpirada = oferta.estado?.toLowerCase() === "expirada";
                  const isExpanded = expandedRow === oferta.id;
                  const isRespondida =
                    oferta.estado?.toLowerCase() === "aceptada" ||
                    oferta.estado?.toLowerCase() === "rechazada";

                  return (
                    <>
                      <TableRow
                        key={oferta.id}
                        sx={{
                          opacity: isExpirada ? 0.5 : 1,
                          "&:hover": { backgroundColor: "#F8FAFC" },
                          cursor: isExpirada ? "default" : "pointer",
                          "& > td": { borderBottom: isExpanded ? 0 : undefined },
                        }}
                        onClick={() => !isExpirada && handleToggleRow(oferta.id)}
                      >
                        <TableCell sx={{ width: 48, px: 1 }}>
                          {!isExpirada && (
                            <IconButton size="small">
                              {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "#1E293B" }}
                            >
                              {oferta.factoring?.razonSocial || "N/A"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#64748B" }}>
                              {oferta.factoring?.rut || ""}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: "#00A86B", fontWeight: 600 }}
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
                            sx={{ color: "#1E293B", fontWeight: 500 }}
                          >
                            {parseFloat(oferta.tasa || "0").toFixed(2)}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: "#00A86B", fontWeight: 600 }}
                          >
                            {formatCurrency(oferta.montoAdelanto)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${factura?.plazo || 0} días`}
                            size="small"
                            sx={{
                              backgroundColor: "#F1F5F9",
                              color: "#475569",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: isExpirada ? "#EF4444" : "#64748B" }}
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
                                backgroundColor: "#F8FAFC",
                                borderBottom: "1px solid #E2E8F0",
                              }}
                            >
                              {/* Comentario */}
                              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}>
                                <Comment sx={{ fontSize: 18, color: "#64748B", mt: 0.3 }} />
                                <Box>
                                  <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
                                    Comentario del factoring
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: "#1E293B", mt: 0.5 }}>
                                    {oferta.comentario || "Sin comentario"}
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Action buttons */}
                              {!isRespondida && !isExpirada && (
                                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                                  <Button
                                    variant="contained"
                                    startIcon={<CheckCircle />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAceptarModal({ open: true, oferta });
                                    }}
                                    sx={{
                                      backgroundColor: "#00A86B",
                                      color: "white",
                                      textTransform: "none",
                                      fontWeight: 600,
                                      borderRadius: 2,
                                      px: 3,
                                      py: 1,
                                      "&:hover": { backgroundColor: "#008F5B" },
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
                                      borderColor: "#EF4444",
                                      color: "#EF4444",
                                      textTransform: "none",
                                      fontWeight: 600,
                                      borderRadius: 2,
                                      px: 3,
                                      py: 1,
                                      "&:hover": {
                                        borderColor: "#DC2626",
                                        backgroundColor: "rgba(239, 68, 68, 0.04)",
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
          onSuccess={handleModalSuccess}
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
          onSuccess={handleModalSuccess}
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
