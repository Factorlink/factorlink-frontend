import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";
import PaymentsIcon from "@mui/icons-material/Payments";
import PercentIcon from "@mui/icons-material/Percent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { formatMoney, formatPercent, type OptionalValue } from "../../utils/ofertaFormatters";

interface FacturaCedidaModalProps {
  open: boolean;
  factoringName: string;
  montoAFinanciar: OptionalValue;
  tasa30Dias: OptionalValue;
  onClose: () => void;
}

const SummaryRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 2,
      py: 1.25,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
      {icon}
      <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
        {label}
      </Typography>
    </Box>
    <Typography
      variant="body2"
      sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}
    >
      {value}
    </Typography>
  </Box>
);

const FacturaCedidaModal = ({
  open,
  factoringName,
  montoAFinanciar,
  tasa30Dias,
  onClose,
}: FacturaCedidaModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick") return;
        onClose();
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(8px)",
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "var(--radius-l)",
          maxWidth: 420,
          width: "100%",
          p: 1,
          textAlign: "center",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label="Cerrar"
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ px: 4, pt: 5, pb: 2 }}>
        <Box
          sx={{
            width: 88,
            height: 88,
            mx: "auto",
            mb: 3,
            borderRadius: "50%",
            backgroundColor: "var(--color-bg-success-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckCircleIcon
            sx={{ fontSize: 56, color: "var(--color-fg-success-primary)" }}
          />
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "var(--color-fg-default-primary)",
            mb: 3,
          }}
        >
          ¡La factura ya se cedió!
        </Typography>

        <Box
          sx={{
            border: "1px solid var(--color-border-default-primary)",
            borderRadius: "var(--radius-m)",
            px: 2,
            py: 0.5,
            textAlign: "left",
            backgroundColor: "var(--color-bg-default-secondary, transparent)",
          }}
        >
          <SummaryRow
            icon={
              <BusinessIcon
                sx={{ fontSize: 20, color: "var(--color-fg-accent-primary)" }}
              />
            }
            label="Factoring"
            value={factoringName}
          />
          <SummaryRow
            icon={
              <PaymentsIcon
                sx={{ fontSize: 20, color: "var(--color-fg-success-primary)" }}
              />
            }
            label="Monto a financiar"
            value={formatMoney(montoAFinanciar)}
          />
          <SummaryRow
            icon={
              <PercentIcon
                sx={{ fontSize: 20, color: "var(--color-fg-success-primary)" }}
              />
            }
            label="Tasa 30 días"
            value={formatPercent(tasa30Dias)}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 3, pt: 1 }}>
        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            py: 1.5,
            backgroundColor: "var(--color-bg-accent-primary)",
            "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
            color: "var(--color-fg-on-accent-primary)",
          }}
        >
          Ir a facturas cedidas
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FacturaCedidaModal;
