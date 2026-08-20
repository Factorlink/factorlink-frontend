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
import DescriptionIcon from "@mui/icons-material/Description";
import PaymentsIcon from "@mui/icons-material/Payments";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { formatCurrency } from "../Facturas/FacturaResumenCard";

interface FacturaEnviadaCotizarModalProps {
  open: boolean;
  folio: string;
  montoTotal: string;
  visibilidad: "TODOS" | "SELECCIONADOS";
  onGoToFacturas: () => void;
}

const MONTHS_ES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
] as const;

const formatFechaEnvio = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTHS_ES[date.getMonth()];
  return `${day} ${month} ${date.getFullYear()}`;
};

const visibilidadLabel = (visibilidad: "TODOS" | "SELECCIONADOS") =>
  visibilidad === "TODOS"
    ? "Todos los Factorings"
    : "Solo Factorings seleccionados";

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

const FacturaEnviadaCotizarModal = ({
  open,
  folio,
  montoTotal,
  visibilidad,
  onGoToFacturas,
}: FacturaEnviadaCotizarModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick") return;
        onGoToFacturas();
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
        onClick={onGoToFacturas}
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
          ¡Factura enviada a cotizar con éxito!
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
              <DescriptionIcon
                sx={{ fontSize: 20, color: "var(--color-fg-accent-primary)" }}
              />
            }
            label="Folio"
            value={`#${folio}`}
          />
          <SummaryRow
            icon={
              <PaymentsIcon
                sx={{ fontSize: 20, color: "var(--color-fg-success-primary)" }}
              />
            }
            label="Monto total"
            value={formatCurrency(montoTotal)}
          />
          <SummaryRow
            icon={
              <CalendarTodayIcon
                sx={{ fontSize: 20, color: "var(--color-fg-success-primary)" }}
              />
            }
            label="Fecha de envío"
            value={formatFechaEnvio(new Date())}
          />
          <SummaryRow
            icon={
              <VisibilityIcon
                sx={{ fontSize: 20, color: "var(--color-fg-success-primary)" }}
              />
            }
            label="Visibilidad"
            value={visibilidadLabel(visibilidad)}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 3, pt: 1 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<VisibilityIcon />}
          endIcon={<ArrowForwardIcon />}
          onClick={onGoToFacturas}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            py: 1.5,
            backgroundColor: "var(--color-bg-accent-primary)",
            "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
            color: "var(--color-fg-on-accent-primary)",
          }}
        >
          Ir a facturas
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FacturaEnviadaCotizarModal;
