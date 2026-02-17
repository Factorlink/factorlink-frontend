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
} from "@mui/material";
import { Close, Visibility, Storefront } from "@mui/icons-material";
import { useOfertas } from "../../hooks/useOfertas";
import type { Factura } from "../../types/factura";
import type { Oferta } from "../../types/oferta";

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

  useEffect(() => {
    if (open && factura?.id) {
      const fetchOfertas = async () => {
        try {
          const data = await getOfertasByFacturaId(factura.id);
          setOfertas(Array.isArray(data) ? data : data?.data || []);
        } catch {
          setOfertas([]);
        }
      };
      fetchOfertas();
    } else {
      setOfertas([]);
    }
  }, [open, factura?.id]);

  const activas = ofertas.filter(
    (o) =>
      o.estado?.toLowerCase() !== "expirada" &&
      o.estado?.toLowerCase() !== "rechazada",
  ).length;

  return (
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
                <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                  Acción
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ofertas.map((oferta) => {
                const isExpirada = oferta.estado?.toLowerCase() === "expirada";
                return (
                  <TableRow
                    key={oferta.id}
                    sx={{
                      opacity: isExpirada ? 0.5 : 1,
                      "&:hover": { backgroundColor: "#F8FAFC" },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
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
                    <TableCell>
                      <Chip
                        icon={<Visibility sx={{ fontSize: 16 }} />}
                        label="Ver detalle"
                        clickable={!isExpirada}
                        disabled={isExpirada}
                        sx={{
                          backgroundColor: isExpirada ? "#E2E8F0" : "#334155",
                          color: isExpirada ? "#94A3B8" : "white",
                          fontWeight: 500,
                          "& .MuiChip-icon": {
                            color: isExpirada ? "#94A3B8" : "white",
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Drawer>
  );
};

export default OfertasDrawer;
