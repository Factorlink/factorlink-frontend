import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
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
import {
  Storefront,
  Visibility,
  Cancel,
  Groups,
} from "@mui/icons-material";
import { useFacturas } from "../../hooks/useFacturas";
import type { Factura } from "../../types/factura";
import RemoveMarketplaceModal from "../Modals/RemoveMarketplaceModal";

interface MarketplaceFacturasTableProps {
  empresaId: string;
  onRemoveSuccess?: () => void;
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

const MarketplaceFacturasTable = ({
  empresaId,
  onRemoveSuccess,
}: MarketplaceFacturasTableProps) => {
  const { listFromMarketplace, loading } = useFacturas();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);

  const fetchMarketplace = useCallback(async () => {
    if (!empresaId) return;
    try {
      const response = await listFromMarketplace(empresaId);
      setFacturas(response?.data || response || []);
    } catch {
      setFacturas([]);
    }
  }, [empresaId]);

  useEffect(() => {
    fetchMarketplace();
  }, [fetchMarketplace]);

  const handleOpenRemoveModal = (factura: Factura) => {
    setSelectedFactura(factura);
    setRemoveModalOpen(true);
  };

  const handleRemoveSuccess = () => {
    fetchMarketplace();
    onRemoveSuccess?.();
  };

  const getOfertasCount = (factura: Factura) => {
    return (factura as any).ofertasCount ?? (factura as any).ofertas ?? 0;
  };

  return (
    <>
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : facturas.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
          }}
        >
          <Storefront sx={{ fontSize: 64, color: "#CBD5E1", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#64748B", fontWeight: 500 }}>
            No hay facturas en marketplace
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8", mt: 1 }}>
            Las facturas enviadas a cotizar aparecerán aquí
          </Typography>
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Folio
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Receptor
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Fecha Emisión
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Monto a Financiar
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Plazo
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Estado
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Ofertas
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#64748B" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facturas.map((factura) => (
              <TableRow
                key={factura.id}
                sx={{
                  "&:hover": { backgroundColor: "#F8FAFC" },
                  "&:last-child td": { borderBottom: 0 },
                }}
              >
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ color: "#00BCD4", fontWeight: 600 }}
                  >
                    #F-{factura.folio}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#1E293B" }}
                    >
                      {factura.razonSocialReceptor || "N/A"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      {factura.rutReceptor || ""}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "#64748B" }}>
                    {formatDate(factura.fechaEmision)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ color: "#00A86B", fontWeight: 600 }}
                  >
                    {formatCurrency(factura.montoFinanciar)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${factura.plazo || 0} días`}
                    size="small"
                    sx={{
                      backgroundColor: "#F1F5F9",
                      color: "#475569",
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<Storefront sx={{ fontSize: 14 }} />}
                    label="EN MARKETPLACE"
                    size="small"
                    sx={{
                      backgroundColor: "rgba(0, 188, 212, 0.1)",
                      color: "#00BCD4",
                      fontWeight: 500,
                      "& .MuiChip-icon": { color: "#00BCD4" },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <Groups sx={{ fontSize: 18, color: "#64748B" }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#1E293B", fontWeight: 500 }}
                    >
                      {getOfertasCount(factura)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<Visibility sx={{ fontSize: 16 }} />}
                      sx={{
                        backgroundColor: "#334155",
                        color: "white",
                        "&:hover": { backgroundColor: "#1E293B" },
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                        fontSize: "0.75rem",
                        px: 1.5,
                        py: 0.5,
                      }}
                    >
                      Ver ofertas
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Cancel sx={{ fontSize: 16 }} />}
                      onClick={() => handleOpenRemoveModal(factura)}
                      sx={{
                        borderColor: "#E2E8F0",
                        color: "#EF4444",
                        "&:hover": {
                          borderColor: "#EF4444",
                          backgroundColor: "rgba(239, 68, 68, 0.04)",
                        },
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                        fontSize: "0.75rem",
                        px: 1.5,
                        py: 0.5,
                      }}
                    >
                      Quitar
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>

    {selectedFactura && (
      <RemoveMarketplaceModal
        open={removeModalOpen}
        onClose={() => {
          setRemoveModalOpen(false);
          setSelectedFactura(null);
        }}
        onSuccess={handleRemoveSuccess}
        facturaData={{
          id: selectedFactura.id,
          folio: selectedFactura.folio,
          razonSocialReceptor: selectedFactura.razonSocialReceptor || "N/A",
        }}
      />
    )}
    </>
  );
};

export default MarketplaceFacturasTable;
