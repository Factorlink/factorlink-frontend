import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  IconButton,
  Alert,
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

interface SyncFacturasSiiModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  empresaId: string;
}

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
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null
  );
  const [alertMessage, setAlertMessage] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [touched, setTouched] = useState({ month: false, year: false });

  const { syncFacturasSii, loading } = useFacturas();
  const years = generateYears();

  const handleSync = async () => {
    setTouched({ month: true, year: true });

    if (!month || !year) {
      return;
    }

    try {
      await syncFacturasSii(month, year, empresaId);
      setAlertStatus("success");
      setAlertMessage(
        `Las facturas del período ${MONTHS.find((m) => m.value === month)?.label} ${year} se han sincronizado correctamente.`
      );
      onSuccess?.();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al sincronizar las facturas con el SII"
      );
    }
  };

  const handleClose = () => {
    setAlertStatus(null);
    setAlertMessage("");
    setMonth("");
    setYear("");
    setTouched({ month: false, year: false });
    onClose();
  };

  const isFormValid = month !== "" && year !== "";
  const showMonthError = touched.month && !month;
  const showYearError = touched.year && !year;

  return (
    <Dialog
      open={open}
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
        <IconButton onClick={handleClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        {alertStatus && (
          <Alert severity={alertStatus} sx={{ mb: 3 }}>
            {alertMessage}
          </Alert>
        )}

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Selecciona el período para sincronizar las facturas desde el SII.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2, flexDirection: "column" }}>
          <FormControl
            fullWidth
            error={showMonthError}
            disabled={loading || alertStatus === "success"}
          >
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

          <FormControl
            fullWidth
            error={showYearError}
            disabled={loading || alertStatus === "success"}
          >
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
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
          >
            {alertStatus === "success" ? "Cerrar" : "Cancelar"}
          </Button>

          {alertStatus !== "success" && (
            <Button
              variant="contained"
              onClick={handleSync}
              disabled={loading || !isFormValid}
              startIcon={
                loading ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  <SyncIcon />
                )
              }
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  boxShadow: "none",
                },
              }}
            >
              {loading ? "Sincronizando..." : "Sincronizar"}
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SyncFacturasSiiModal;
