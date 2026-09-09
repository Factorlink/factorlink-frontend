import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  Paper,
} from "@mui/material";
import { Close, Storefront } from "@mui/icons-material";
import type { Factura } from "../../types/factura";
import { formatMoney } from "../../utils/ofertaFormatters";
import FacturaOfertasList from "./FacturaOfertasList";

interface OfertasDrawerProps {
  open: boolean;
  onClose: () => void;
  factura: Factura | null;
  initialOfertaId?: string | null;
  onOfertasActualizadas?: () => void;
  /** Stack above another Drawer (e.g. FacturaDetalleDrawer). */
  elevated?: boolean;
}

const OfertasDrawer = ({
  open,
  onClose,
  factura,
  initialOfertaId,
  onOfertasActualizadas,
  elevated = false,
}: OfertasDrawerProps) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={
        elevated
          ? {
              zIndex: (theme) => theme.zIndex.modal + 2,
            }
          : undefined
      }
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
            sx={{
              fontWeight: 700,
              color: "var(--color-fg-default-primary)",
              mb: 1.5,
            }}
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
              <Typography
                variant="caption"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
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
              <Typography
                variant="caption"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
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
              <Typography
                variant="caption"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
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
              <Typography
                variant="caption"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
                Monto a Financiar:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: "var(--color-fg-success-primary)",
                }}
              >
                {formatMoney(factura.montoFinanciar)}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
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

      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        {factura && (
          <FacturaOfertasList
            factura={factura}
            enabled={open}
            initialOfertaId={initialOfertaId}
            onOfertasActualizadas={onOfertasActualizadas}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default OfertasDrawer;
