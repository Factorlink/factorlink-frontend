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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { StyledTextField, StyledDatePicker } from "../../pages/register/styles";
import { useOfertas } from "../../hooks/useOfertas";
import type { Factura } from "../../types/factura";
import ConfirmarOfertaModal from "../Modals/ConfirmarOfertaModal";
import { formatMoney } from "../../utils/ofertaFormatters";
import { handleTextInputChange } from "../../utils/validations/shared-fields";
import {
  createOfertaFormSchema,
  handleDecimalRateInputChange,
  handleNonNegativeIntegerInputChange,
} from "../../utils/validations/oferta-fields";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const blockNonNumericKeys = (
  e: React.KeyboardEvent<HTMLInputElement>,
  allowDecimal = false,
) => {
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

const INTEGER_FIELDS = [
  {
    name: "numeroDocumentos",
    label: "Número de documentos",
    helper: "Cantidad de documentos de la operación",
  },
  {
    name: "plazoPromedioPago",
    label: "Plazo promedio de pago (días)",
    helper: "Promedio de días de pago",
  },
] as const;

const MONEY_FIELDS = [
  { name: "montoDocumentos", label: "Monto de documentos" },
  { name: "diferenciaPrecio", label: "Diferencia de precio" },
  { name: "montoComision", label: "Monto de comisión" },
  { name: "retencion", label: "Retención" },
  { name: "notaria", label: "Notaría" },
  { name: "gastosCobrados", label: "Gastos cobrados" },
  { name: "iva", label: "IVA" },
  { name: "recuperacionGastos", label: "Recuperación de gastos" },
  { name: "recaudacion", label: "Recaudación" },
  { name: "excedentes", label: "Excedentes" },
  { name: "montoAGirar", label: "Monto a girar" },
] as const;

interface EnviarOfertaCardProps {
  factura: Factura;
  factoringId: string;
  onSuccess?: () => void;
}

const sectionTitleSx = {
  fontWeight: 600,
  color: "text.primary",
  mb: 2,
};

const gridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
  gap: 2,
};

const EnviarOfertaCard = ({
  factura,
  factoringId,
  onSuccess,
}: EnviarOfertaCardProps) => {
  const { createOferta, loading } = useOfertas();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openPicker, setOpenPicker] = useState<
    "fechaExpiracion" | "fechaOperacion" | null
  >(null);
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [alertMessage, setAlertMessage] = useState("");

  const montoFinanciar = parseFloat(factura.montoFinanciar) || 0;

  const formik = useFormik({
    initialValues: {
      porcentajeFinanciamiento: 100 as number | string,
      tasa: 0 as number | string,
      fechaExpiracion: null as Date | null,
      comentario: "",
      tipoDocumento: factura.tipoDocumento || "",
      fechaOperacion: null as Date | null,
      numeroDocumentos: "",
      plazoPromedioPago: "",
      montoDocumentos: "",
      tasaComision: "" as number | string,
      diferenciaPrecio: "",
      montoComision: "",
      retencion: "",
      notaria: "",
      gastosCobrados: "",
      iva: "",
      recuperacionGastos: "",
      recaudacion: "",
      excedentes: "",
      montoAGirar: "",
    },
    validationSchema: createOfertaFormSchema(today),
    onSubmit: () => {
      setConfirmOpen(true);
    },
  });

  const montoAdelanto = Math.round(
    (montoFinanciar * (Number(formik.values.porcentajeFinanciamiento) || 0)) /
      100,
  );

  const fieldError = (name: keyof typeof formik.values) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const fieldHelper = (name: keyof typeof formik.values, fallback: string) =>
    formik.touched[name]
      ? (formik.errors[name] as string) || fallback
      : fallback;

  const handleConfirm = async () => {
    try {
      setAlertStatus(null);
      await createOferta({
        facturaId: factura.id,
        factoringId,
        porcentajeFinanciamiento: formik.values.porcentajeFinanciamiento,
        tasa: formik.values.tasa,
        montoAdelanto,
        fechaExpiracion: formik.values.fechaExpiracion!,
        comentario: formik.values.comentario,
        tipoDocumento: formik.values.tipoDocumento,
        fechaOperacion: formik.values.fechaOperacion,
        numeroDocumentos: formik.values.numeroDocumentos,
        plazoPromedioPago: formik.values.plazoPromedioPago,
        montoDocumentos: formik.values.montoDocumentos,
        tasaComision: formik.values.tasaComision,
        diferenciaPrecio: formik.values.diferenciaPrecio,
        montoComision: formik.values.montoComision,
        retencion: formik.values.retencion,
        notaria: formik.values.notaria,
        gastosCobrados: formik.values.gastosCobrados,
        iva: formik.values.iva,
        recuperacionGastos: formik.values.recuperacionGastos,
        recaudacion: formik.values.recaudacion,
        excedentes: formik.values.excedentes,
        montoAGirar: formik.values.montoAGirar,
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
          "Ocurrió un error al enviar la oferta",
      );
    }
  };

  const renderDatePicker = (
    name: "fechaExpiracion" | "fechaOperacion",
    label: string,
    fallbackHelper: string,
    minDate?: Date,
  ) => (
    <StyledDatePicker
      label={label}
      value={formik.values[name]}
      open={openPicker === name}
      onOpen={() => setOpenPicker(name)}
      onClose={() => {
        setOpenPicker(null);
        formik.setFieldTouched(name, true, false);
      }}
      onChange={(value) => {
        formik.setFieldValue(name, value, true);
        formik.setFieldTouched(name, true, false);
      }}
      onAccept={() => formik.setFieldTouched(name, true, false)}
      minDate={minDate}
      format="dd/MM/yyyy"
      slotProps={{
        field: { readOnly: true },
        openPickerButton: { tabIndex: -1 },
        textField: {
          fullWidth: true,
          onClick: () => setOpenPicker(name),
          onKeyDown: (e) => e.preventDefault(),
          onBlur: () => formik.setFieldTouched(name, true, false),
          error: fieldError(name),
          helperText: fieldHelper(name, fallbackHelper),
          sx: {
            cursor: "pointer",
            "& .MuiOutlinedInput-root": {
              cursor: "pointer",
              "& input": { cursor: "pointer" },
            },
          },
        },
      }}
    />
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box
        sx={{
          backgroundColor: "var(--color-bg-default-primary)",
          borderRadius: 3,
          boxShadow: "var(--shadow-popover)",
          overflow: "hidden",
          mb: 3,
        }}
      >
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
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Enviar oferta
          </Typography>
        </Box>

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

          <Typography variant="subtitle1" sx={sectionTitleSx}>
            Condiciones de financiamiento
          </Typography>
          <Box sx={{ ...gridSx, mb: 1 }}>
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
                if (/^0+$/.test(val)) return;
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              onKeyDown={(e) =>
                blockNonNumericKeys(
                  e as React.KeyboardEvent<HTMLInputElement>,
                  false,
                )
              }
              error={fieldError("porcentajeFinanciamiento")}
              helperText={fieldHelper(
                "porcentajeFinanciamiento",
                "Entre 1% y 100%",
              )}
            />

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
              onChange={(e) =>
                handleDecimalRateInputChange(
                  e as React.ChangeEvent<HTMLInputElement>,
                  formik.setFieldValue,
                )
              }
              onBlur={formik.handleBlur}
              onKeyDown={(e) =>
                blockNonNumericKeys(
                  e as React.KeyboardEvent<HTMLInputElement>,
                  true,
                )
              }
              error={fieldError("tasa")}
              helperText={fieldHelper("tasa", "Tasa aplicada a la oferta")}
            />

            <StyledTextField
              fullWidth
              label="Monto adelanto"
              value={formatMoney(montoAdelanto)}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalance
                      sx={{ color: "primary.main", fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root input": {
                  color: "primary.main",
                  fontWeight: 600,
                },
              }}
              helperText={`Calculado automáticamente (${formik.values.porcentajeFinanciamiento || 0}% de ${formatMoney(montoFinanciar)})`}
            />

            <Tooltip
              title="Este campo no puede ser editado. El plazo es definido por la empresa emisora."
              arrow
            >
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

            {renderDatePicker(
              "fechaExpiracion",
              "Fecha de expiración",
              "Fecha límite para que la empresa acepte",
              tomorrow,
            )}
          </Box>

          <Typography variant="subtitle1" sx={sectionTitleSx}>
            Información de la operación
          </Typography>
          <Box sx={{ ...gridSx, mb: 1 }}>
            <StyledTextField
              fullWidth
              name="tipoDocumento"
              label="Tipo de documento"
              value={formik.values.tipoDocumento}
              onChange={(e) =>
                handleTextInputChange(
                  e as React.ChangeEvent<HTMLInputElement>,
                  formik.setFieldValue,
                )
              }
              onBlur={formik.handleBlur}
              inputProps={{ maxLength: 100 }}
              error={fieldError("tipoDocumento")}
              helperText={fieldHelper(
                "tipoDocumento",
                "Ej: Facturas",
              )}
            />

            {renderDatePicker(
              "fechaOperacion",
              "Fecha de operación",
              "Fecha de la operación",
            )}

            {INTEGER_FIELDS.map((field) => (
              <StyledTextField
                key={field.name}
                fullWidth
                name={field.name}
                label={field.label}
                type="string"
                inputMode="numeric"
                value={formik.values[field.name]}
                onChange={(e) =>
                  handleNonNegativeIntegerInputChange(
                    e as React.ChangeEvent<HTMLInputElement>,
                    formik.setFieldValue,
                  )
                }
                onBlur={formik.handleBlur}
                onKeyDown={(e) =>
                  blockNonNumericKeys(
                    e as React.KeyboardEvent<HTMLInputElement>,
                    false,
                  )
                }
                error={fieldError(field.name)}
                helperText={fieldHelper(field.name, field.helper)}
              />
            ))}
          </Box>

          <Typography variant="subtitle1" sx={sectionTitleSx}>
            Montos y condiciones
          </Typography>
          <Box sx={{ ...gridSx, mb: 1 }}>
            <StyledTextField
              fullWidth
              name="tasaComision"
              label="Tasa de comisión (%)"
              type="string"
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">%</InputAdornment>
                ),
              }}
              value={formik.values.tasaComision}
              onChange={(e) =>
                handleDecimalRateInputChange(
                  e as React.ChangeEvent<HTMLInputElement>,
                  formik.setFieldValue,
                )
              }
              onBlur={formik.handleBlur}
              onKeyDown={(e) =>
                blockNonNumericKeys(
                  e as React.KeyboardEvent<HTMLInputElement>,
                  true,
                )
              }
              error={fieldError("tasaComision")}
              helperText={fieldHelper(
                "tasaComision",
                "Tasa de comisión aplicada",
              )}
            />

            {MONEY_FIELDS.map((field) => (
              <StyledTextField
                key={field.name}
                fullWidth
                name={field.name}
                label={field.label}
                type="string"
                inputMode="numeric"
                value={formik.values[field.name]}
                onChange={(e) =>
                  handleNonNegativeIntegerInputChange(
                    e as React.ChangeEvent<HTMLInputElement>,
                    formik.setFieldValue,
                  )
                }
                onBlur={formik.handleBlur}
                onKeyDown={(e) =>
                  blockNonNumericKeys(
                    e as React.KeyboardEvent<HTMLInputElement>,
                    false,
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                error={fieldError(field.name)}
                helperText={fieldHelper(field.name, "Mayor o igual a 0")}
              />
            ))}
          </Box>

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
            error={fieldError("comentario")}
            helperText={fieldHelper("comentario", "Máximo 500 caracteres")}
          />

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
              disabled={
                alertStatus === "success" ||
                !formik.isValid ||
                !formik.dirty ||
                !formik.values.fechaExpiracion ||
                !formik.values.fechaOperacion
              }
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "var(--color-fg-on-accent-primary)",
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

      <ConfirmarOfertaModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
        data={{
          porcentajeFinanciamiento: Number(
            formik.values.porcentajeFinanciamiento,
          ),
          montoAdelanto,
          tasa: Number(formik.values.tasa),
          plazo: factura.plazo || 0,
        }}
      />
    </LocalizationProvider>
  );
};

export default EnviarOfertaCard;
