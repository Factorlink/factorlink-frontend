import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Alert,
  AlertTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import PaymentsIcon from "@mui/icons-material/Payments";
import PercentIcon from "@mui/icons-material/Percent";
import ScheduleIcon from "@mui/icons-material/Schedule";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsIcon from "@mui/icons-material/Groups";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { formatCurrency } from "../Facturas/FacturaResumenCard";

export type GrupoEnviadoCotizarSummary = {
  nombre: string;
  cantidadFacturas: number;
  montoTotal: number;
  porcentajeFinanciamiento: number;
  montoAFinanciar: number;
  plazo: number;
};

interface GrupoEnviadoCotizarModalProps {
  open: boolean;
  summary: GrupoEnviadoCotizarSummary;
  onGoToFacturas: () => void;
  onVerGrupo: () => void;
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
      <Typography
        variant="body2"
        sx={{ color: "var(--color-fg-default-secondary)" }}
      >
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

const GrupoEnviadoCotizarModal = ({
  open,
  summary,
  onGoToFacturas,
  onVerGrupo,
}: GrupoEnviadoCotizarModalProps) => {
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
          maxWidth: 440,
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
            mb: 1,
          }}
        >
          ¡Grupo enviado a cotizar!
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "var(--color-fg-default-secondary)", mb: 3 }}
        >
          {summary.cantidadFacturas === 1
            ? "La factura seleccionada ha sido enviada al marketplace y está disponible para que los factoring interesados envíen sus ofertas."
            : `Las ${summary.cantidadFacturas} facturas seleccionadas han sido enviadas al marketplace y están disponibles para que los factoring interesados envíen sus ofertas.`}
        </Typography>

        <Box
          sx={{
            border: "1px solid var(--color-border-default-primary)",
            borderRadius: "var(--radius-m)",
            px: 2,
            py: 0.5,
            mb: 2,
            textAlign: "left",
            backgroundColor: "var(--color-bg-default-secondary, transparent)",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: "var(--color-fg-default-primary)",
              pt: 1.25,
              pb: 0.5,
            }}
          >
            Resumen del grupo enviado
          </Typography>
          <SummaryRow
            icon={
              <GroupsIcon
                sx={{ fontSize: 20, color: "var(--color-fg-accent-primary)" }}
              />
            }
            label="Nombre"
            value={summary.nombre}
          />
          <SummaryRow
            icon={
              <DescriptionIcon
                sx={{ fontSize: 20, color: "var(--color-fg-accent-primary)" }}
              />
            }
            label="Facturas enviadas"
            value={String(summary.cantidadFacturas)}
          />
          <SummaryRow
            icon={
              <PaymentsIcon
                sx={{ fontSize: 20, color: "var(--color-fg-success-primary)" }}
              />
            }
            label="Monto total del grupo"
            value={formatCurrency(summary.montoTotal)}
          />
          <SummaryRow
            icon={
              <PercentIcon
                sx={{ fontSize: 20, color: "var(--color-fg-accent-primary)" }}
              />
            }
            label="Porcentaje a financiar"
            value={`${summary.porcentajeFinanciamiento}%`}
          />
          <SummaryRow
            icon={
              <PaymentsIcon
                sx={{ fontSize: 20, color: "var(--color-fg-success-primary)" }}
              />
            }
            label="Monto a financiar"
            value={formatCurrency(summary.montoAFinanciar)}
          />
          <SummaryRow
            icon={
              <ScheduleIcon
                sx={{ fontSize: 20, color: "var(--color-fg-success-primary)" }}
              />
            }
            label="Plazo de pago solicitado"
            value={`${summary.plazo} días`}
          />
        </Box>

        <Alert
          severity="info"
          icon={<InfoOutlinedIcon />}
          sx={{
            textAlign: "left",
            borderRadius: "var(--radius-m)",
          }}
        >
          <AlertTitle sx={{ fontWeight: 700 }}>¿Qué sigue?</AlertTitle>
          Recibirás notificaciones cuando los factoring envíen ofertas para este
          grupo.
        </Alert>
      </DialogContent>

      <DialogActions
        sx={{
          px: 4,
          pb: 3,
          pt: 1,
          flexDirection: "column",
          gap: 1.5,
          alignItems: "stretch",
        }}
      >
        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          onClick={onGoToFacturas}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            py: 1.5,
            m: "0 !important",
            backgroundColor: "var(--color-bg-accent-primary)",
            "&:hover": {
              backgroundColor: "var(--color-bg-accent-primary-hover)",
            },
            color: "var(--color-fg-on-accent-primary)",
          }}
        >
          Ir a facturas
        </Button>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<VisibilityIcon />}
          onClick={onVerGrupo}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            py: 1.5,
            m: "0 !important",
            borderColor: "var(--color-border-default-primary)",
            color: "var(--color-fg-default-primary)",
            "&:hover": {
              borderColor: "var(--color-fg-default-secondary)",
              backgroundColor: "var(--color-bg-default-tertiary)",
            },
          }}
        >
          Ver grupo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GrupoEnviadoCotizarModal;
