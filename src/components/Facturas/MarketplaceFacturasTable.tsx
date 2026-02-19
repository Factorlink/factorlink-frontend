import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Storefront,
  Visibility,
  Groups,
  MoreVert,
  Delete,
} from "@mui/icons-material";
import { useFacturas } from "../../hooks/useFacturas";
import type { Factura } from "../../types/factura";
import RemoveMarketplaceModal from "../Modals/RemoveMarketplaceModal";
import OfertasDrawer from "./OfertasDrawer";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    factura: Factura,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedFactura(factura);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFactura(null);
  };

  const handleVerOfertas = () => {
    if (selectedFactura && (selectedFactura.numeroOfertasRecibidas ?? 0) > 0) {
      setDrawerOpen(true);
    }
    setAnchorEl(null);
  };

  const handleOpenRemoveModal = () => {
    // selectedFactura is already set by handleMenuOpen
    setRemoveModalOpen(true);
    setAnchorEl(null);
  };

  const handleRemoveSuccess = () => {
    fetchMarketplace();
    onRemoveSuccess?.();
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
                      {factura.folio}
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
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Groups sx={{ fontSize: 18, color: "#64748B" }} />
                      <Typography
                        variant="body2"
                        sx={{ color: "#1E293B", fontWeight: 500 }}
                      >
                        {factura.numeroOfertasRecibidas || 0}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, factura)}
                      sx={{ color: "#64748B" }}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleVerOfertas}>
          <ListItemIcon>
            <Visibility sx={{ color: "#64748B" }} />
          </ListItemIcon>
          <ListItemText primary="Ver ofertas" />
        </MenuItem>
        <MenuItem onClick={handleOpenRemoveModal}>
          <ListItemIcon>
            <Delete sx={{ color: "#EF4444" }} />
          </ListItemIcon>
          <ListItemText
            primary="Quitar del marketplace"
            sx={{ "& .MuiTypography-root": { color: "#EF4444" } }}
          />
        </MenuItem>
      </Menu>

      {selectedFactura && (
        <RemoveMarketplaceModal
          open={removeModalOpen}
          onClose={() => {
            setRemoveModalOpen(false);
            // Don't clear selectedFactura here if we want to be safe, 
            // but usually modal close implies we are done with it or cancelled.
            // The original code cleared it. I will keep it consistent.
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
      <OfertasDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        factura={selectedFactura}
      />
    </>
  );
};

export default MarketplaceFacturasTable;
