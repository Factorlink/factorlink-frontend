import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SyncIcon from "@mui/icons-material/Sync";
import { useFacturas } from "../../hooks/useFacturas";
import siiLogo from "../../assets/png/sii-logo.png";
import ObtenerFacturaSiiModal from "./ObtenerFacturaSiiModal";

interface SyncFacturasSiiModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  empresaId: string;
}

type SyncPhase = "form" | "loading" | "error";

const MONTHS = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const DEFAULT_ERROR_SUBTITLE =
  "Ocurrió un error al sincronizar las facturas con el SII";

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= currentYear - 10; year--) {
    years.push({ value: String(year), label: String(year) });
  }
  return years;
};

const SyncFacturasSiiModal = ({
  open,
  onClose,
  onSuccess,
  empresaId,
}: SyncFacturasSiiModalProps) => {
  const [phase, setPhase] = useState<SyncPhase>("form");
  const [errorSubtitle, setErrorSubtitle] = useState(DEFAULT_ERROR_SUBTITLE);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [touched, setTouched] = useState({ month: false, year: false });

  const { syncFacturasSii } = useFacturas();
  const years = generateYears();
  const isSyncing = phase === "loading" || phase === "error";

  const resetForm = useCallback(() => {
    setPhase("form");
    setErrorSubtitle(DEFAULT_ERROR_SUBTITLE);
    setMonth("");
    setYear("");
    setTouched({ month: false, year: false });
  }, []);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  const handleClose = () => {
    if (phase === "loading") return;
    onClose();
  };

  const runSync = useCallback(async () => {
    if (!month || !year) return;

    setPhase("loading");
    try {
      await syncFacturasSii(month, year, empresaId);
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setErrorSubtitle(
        axiosError?.response?.data?.message || DEFAULT_ERROR_SUBTITLE
      );
      setPhase("error");
    }
  }, [month, year, empresaId, syncFacturasSii, onSuccess, onClose]);

  const handleSync = () => {
    setTouched({ month: true, year: true });
    if (!month || !year) return;
    void runSync();
  };

  const handleProgressCancel = () => {
    setPhase("form");
    setErrorSubtitle(DEFAULT_ERROR_SUBTITLE);
  };

  const isFormValid = month !== "" && year !== "";
  const showMonthError = touched.month && !month;
  const showYearError = touched.year && !year;

  return (
    <>
      <Dialog
        open={open && phase === "form"}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "var(--radius-l)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            pt: 3,
            pb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component="img"
              src={siiLogo}
              alt="Logo SII"
              sx={{
                width: 48,
                height: "auto",
                objectFit: "contain",
              }}
            />
            <Typography variant="h6" fontWeight={600}>
              Sincronizar Facturas SII
            </Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 3 }}>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Selecciona el período para sincronizar las facturas desde el SII.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2, flexDirection: "column" }}>
            <FormControl fullWidth error={showMonthError}>
              <InputLabel id="month-label">Mes</InputLabel>
              <Select
                labelId="month-label"
                value={month}
                label="Mes"
                onChange={(e) => setMonth(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, month: true }))}
                sx={{
                  backgroundColor: "var(--color-bg-default-primary)",
                  borderRadius: "var(--radius-m)",
                }}
              >
                {MONTHS.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
              {showMonthError && (
                <FormHelperText>El mes es obligatorio</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={showYearError}>
              <InputLabel id="year-label">Año</InputLabel>
              <Select
                labelId="year-label"
                value={year}
                label="Año"
                onChange={(e) => setYear(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, year: true }))}
                sx={{
                  backgroundColor: "var(--color-bg-default-primary)",
                  borderRadius: "var(--radius-m)",
                }}
              >
                {years.map((y) => (
                  <MenuItem key={y.value} value={y.value}>
                    {y.label}
                  </MenuItem>
                ))}
              </Select>
              {showYearError && (
                <FormHelperText>El año es obligatorio</FormHelperText>
              )}
            </FormControl>
          </Box>

          <Box
            sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}
          >
            <Button variant="outlined" onClick={handleClose}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              onClick={handleSync}
              disabled={!isFormValid}
              startIcon={<SyncIcon />}
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  boxShadow: "none",
                },
              }}
            >
              Sincronizar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <ObtenerFacturaSiiModal
        open={open && isSyncing}
        status={phase === "error" ? "error" : "loading"}
        onRetry={runSync}
        onCancel={handleProgressCancel}
        loadingTitle="Estamos sincronizando tus facturas desde el SII"
        loadingSubtitle="Espera un momento, por favor."
        errorTitle="No pudimos sincronizar las facturas"
        errorSubtitle={errorSubtitle}
      />
    </>
  );
};

export default SyncFacturasSiiModal;
