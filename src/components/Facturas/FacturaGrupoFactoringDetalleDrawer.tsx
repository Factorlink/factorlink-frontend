import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import type { Factura } from "../../types/factura";

type FacturaGrupoFactoringDetalleDrawerProps = {
  open: boolean;
  onClose: () => void;
  factura: Factura | null;
};

const FacturaGrupoFactoringDetalleDrawer = ({
  open,
  onClose,
  factura,
}: FacturaGrupoFactoringDetalleDrawerProps) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 },
          maxWidth: "100%",
          p: 0,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          py: 2.5,
          borderBottom: "1px solid var(--color-border-default-primary)",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "var(--color-fg-default-primary)",
            }}
          >
            Detalle de la factura
            {factura?.folio ? ` #${factura.folio}` : ""}
          </Typography>
          {factura?.razonSocialReceptor && (
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-default-secondary)", mt: 0.5 }}
            >
              {factura.razonSocialReceptor}
            </Typography>
          )}
        </Box>
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{ color: "var(--color-fg-default-secondary)" }}
        >
          <Close />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 3 }}>
        <Typography
          variant="body2"
          sx={{ color: "var(--color-fg-default-secondary)", mb: 3 }}
        >
          El detalle completo de la factura y la creación de ofertas se
          implementarán en una siguiente historia.
        </Typography>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Cerrar
        </Button>
      </Box>
    </Drawer>
  );
};

export default FacturaGrupoFactoringDetalleDrawer;
