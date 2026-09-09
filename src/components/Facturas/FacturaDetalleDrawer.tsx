import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { Close, Description, ErrorOutline } from "@mui/icons-material";
import type { Factura } from "../../types/factura";
import { useFacturas } from "../../hooks/useFacturas";
import FacturaDetallePanel from "./FacturaDetallePanel";

export type FacturaDetalleDrawerProps = {
  open: boolean;
  onClose: () => void;
  facturaId: string | null;
  onDeleted?: () => void;
  onFacturaUpdated?: () => void;
};

const FacturaDetalleDrawer = ({
  open,
  onClose,
  facturaId,
  onDeleted,
  onFacturaUpdated,
}: FacturaDetalleDrawerProps) => {
  const { getFacturaById } = useFacturas();
  const [factura, setFactura] = useState<Factura | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    // getFacturaById is recreated every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open || !facturaId) {
      setFactura(null);
      setError(null);
      setLoading(false);
      return;
    }
    void loadFactura(facturaId);
  }, [open, facturaId, loadFactura]);

  const handleDeleted = () => {
    onDeleted?.();
    onClose();
  };

  const handleFacturaChange = (next: Factura) => {
    setFactura(next);
  };

  const handleMarketplaceChange = () => {
    onFacturaUpdated?.();
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
          mb: 2,
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
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar" size="small">
          <Close />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          pr: 0.5,
        }}
      >
        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 240,
              gap: 2,
            }}
          >
            <CircularProgress
              sx={{ color: "var(--color-fg-accent-primary)" }}
            />
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
              minHeight: 240,
              gap: 2,
              textAlign: "center",
            }}
          >
            <ErrorOutline
              sx={{ fontSize: 48, color: "var(--color-fg-danger-primary)" }}
            />
            <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
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
              minHeight: 240,
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
          <FacturaDetallePanel
            factura={factura}
            onFacturaChange={handleFacturaChange}
            onDeleted={handleDeleted}
            onMarketplaceChange={handleMarketplaceChange}
            variant="drawer"
          />
        )}
      </Box>
    </Drawer>
  );
};

export default FacturaDetalleDrawer;
