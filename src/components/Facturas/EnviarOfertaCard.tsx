import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Send, AccountBalance } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { StyledTextField, StyledDatePicker } from "../../pages/register/styles";
import { useOfertas } from "../../hooks/useOfertas";
import type { Factura } from "../../types/factura";
import ConfirmarOfertaModal from "../Modals/ConfirmarOfertaModal";

const formatCurrency = (value: number) => {
  if (isNaN(value)) return "$0";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(value);
};

const blockNonNumericKeys = (e: React.KeyboardEvent<HTMLInputElement>, allowDecimal = false) => {
  const allowedKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
  ];
  if (allowedKeys.includes(e.key)) return;
  const pattern = allowDecimal ? /^[0-9.]$/ : /^[0-9]$/;
  if (!pattern.test(e.key)) {
    e.preventDefault();
  }
};

interface EnviarOfertaCardProps {
  factura: Factura;
  factoringId: string;
  onSuccess?: () => void;
}

const validationSchema = yup.object({
  porcentajeFinanciamiento: yup
    .number()
    .required("El porcentaje de financiamiento es obligatorio")
    .min(1, "Debe ser al menos 1%")
    .max(100, "No puede superar el 100%"),
  tasa: yup
    .number()
    .required("La tasa es obligatoria")
    .min(0, "La tasa debe ser mayor o igual a 0")
    .max(100, "La tasa no puede superar el 100%"),
  fechaExpiracion: yup
    .date()
    .required("La fecha de expiración es obligatoria")
    .min(new Date(), "La fecha debe ser posterior a hoy")
    .nullable(),
  comentario: yup
    .string()
    .trim()
    .max(500, "El comentario no puede exceder 500 caracteres"),
});

const EnviarOfertaCard = ({
  factura,
  factoringId,
  onSuccess,
}: EnviarOfertaCardProps) => {
  const { createOferta, loading } = useOfertas();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");

  const montoFinanciar = parseFloat(factura.montoFinanciar) || 0;

  const formik = useFormik({
    initialValues: {
      porcentajeFinanciamiento: 100,
      tasa: 0,
      fechaExpiracion: null as Date | null,
      comentario: "",
    },
    validationSchema,
    onSubmit: () => {
      setConfirmOpen(true);
    },
  });

  const montoAdelanto = Math.round(
    (montoFinanciar * (formik.values.porcentajeFinanciamiento || 0)) / 100
  );

  const handleConfirm = async () => {
    try {
      setAlertStatus(null);
      await createOferta({
        facturaId: factura.id,
        factoringId,
        porcentajeFinanciamiento: formik.values.porcentajeFinanciamiento,
        tasa: formik.values.tasa,
        montoAdelanto,
        fechaExpiracion: formik.values.fechaExpiracion!.toISOString(),
        comentario: formik.values.comentario,
      });
      setConfirmOpen(false);
      setAlertStatus("success");
      setAlertMessage("Oferta enviada correctamente.");
      onSuccess?.();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setConfirmOpen(false);
      setAlertStatus("error");
      setAlertMessage(
        axiosError?.response?.data?.message ||
          "Ocurrió un error al enviar la oferta"
      );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
          mb: 3,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Send sx={{ color: "primary.main", fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
            Enviar oferta
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 3 }}>
          {alertStatus && (
            <Alert
              severity={alertStatus}
              sx={{ mb: 3 }}
              onClose={() => {
                setAlertStatus(null);
                setAlertMessage("");
              }}
            >
              {alertMessage}
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            {/* Porcentaje de financiamiento */}
            <StyledTextField
              fullWidth
              name="porcentajeFinanciamiento"
              label="Porcentaje de financiamiento (%)"
              type="string"
              inputProps={{ min: 1, max: 100, step: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">%</InputAdornment>
                ),
              }}
              value={formik.values.porcentajeFinanciamiento}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length > 3) return;
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              onKeyDown={(e) => blockNonNumericKeys(e as React.KeyboardEvent<HTMLInputElement>, false)}
              error={
                formik.touched.porcentajeFinanciamiento &&
                Boolean(formik.errors.porcentajeFinanciamiento)
              }
              helperText={
                formik.touched.porcentajeFinanciamiento
                  ? formik.errors.porcentajeFinanciamiento || "Entre 1% y 100%"
                  : "Entre 1% y 100%"
              }
            />

            {/* Tasa */}
            <StyledTextField
              fullWidth
              name="tasa"
              label="Tasa (%)"
              type="string"
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">%</InputAdornment>
                ),
              }}
              value={formik.values.tasa}
              onChange={(e) => {
                const val = e.target.value;
                // Allow max 3 integer digits and 2 decimal places
                if (/^\d{0,3}(\.\d{0,2})?$/.test(val) || val === "") {
                  formik.handleChange(e);
                }
              }}
              onBlur={formik.handleBlur}
              onKeyDown={(e) => blockNonNumericKeys(e as React.KeyboardEvent<HTMLInputElement>, true)}
              error={formik.touched.tasa && Boolean(formik.errors.tasa)}
              helperText={
                formik.touched.tasa
                  ? formik.errors.tasa || "Tasa aplicada a la oferta"
                  : "Tasa aplicada a la oferta"
              }
            />

            {/* Monto adelanto (read-only, calculated) */}
            <StyledTextField
              fullWidth
              label="Monto adelanto"
              value={formatCurrency(montoAdelanto)}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalance sx={{ color: "primary.main", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root input": {
                  color: "primary.main",
                  fontWeight: 600,
                },
              }}
              helperText={`Calculado automáticamente (${formik.values.porcentajeFinanciamiento || 0}% de ${formatCurrency(montoFinanciar)})`}
            />

            {/* Plazo (informativo) */}
            <Tooltip title="Este campo no puede ser editado. El plazo es definido por la empresa emisora." arrow>
              <StyledTextField
                fullWidth
                label="Plazo (días)"
                value={factura.plazo || 0}
                InputProps={{ readOnly: true }}
                helperText={`Plazo solicitado: ${factura.plazo || 0} días`}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    cursor: "not-allowed",
                    "& input": { cursor: "not-allowed" },
                  },
                }}
              />
            </Tooltip>

            {/* Fecha expiración */}
            <StyledDatePicker
              label="Fecha de expiración"
              value={formik.values.fechaExpiracion}
              onChange={(value) => {
                formik.setFieldValue("fechaExpiracion", value, true);
                formik.setFieldTouched("fechaExpiracion", true, true)
              }}
              onClose={() =>
                formik.setFieldTouched("fechaExpiracion", true, true)
              }
              onAccept={() =>
                formik.setFieldTouched("fechaExpiracion", true, true)
              }
              minDate={new Date()}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                  onBlur: () =>
                    formik.setFieldTouched("fechaExpiracion", true, true),
                  error:
                    formik.touched.fechaExpiracion &&
                    Boolean(formik.errors.fechaExpiracion),
                  helperText:
                    formik.touched.fechaExpiracion
                      ? (formik.errors.fechaExpiracion as string) ||
                        "Fecha límite para que la empresa acepte"
                      : "Fecha límite para que la empresa acepte",
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "background.default",
                    },
                  },
                },
              }}
            />
          </Box>

          {/* Comentario (full width) */}
          <StyledTextField
            fullWidth
            name="comentario"
            label="Comentario"
            placeholder="Añade información adicional sobre tu oferta..."
            multiline
            rows={3}
            inputProps={{ maxLength: 500 }}
            value={formik.values.comentario}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.comentario && Boolean(formik.errors.comentario)}
            helperText={
              formik.touched.comentario
                ? formik.errors.comentario || "Máximo 500 caracteres"
                : "Máximo 500 caracteres"
            }
          />

          {/* Submit */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              borderTop: "1px solid",
              borderColor: "divider",
              pt: 3,
              mt: 1,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              startIcon={<Send />}
              disabled={alertStatus === "success" || !formik.isValid || !formik.dirty || !formik.values.fechaExpiracion}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Enviar oferta
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Confirmation Modal */}
      <ConfirmarOfertaModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
        data={{
          porcentajeFinanciamiento: formik.values.porcentajeFinanciamiento,
          montoAdelanto,
          tasa: formik.values.tasa,
          plazo: factura.plazo || 0,
        }}
      />
    </LocalizationProvider>
  );
};

export default EnviarOfertaCard;
