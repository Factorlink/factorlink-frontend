import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Send, InfoOutlined, Lock } from "@mui/icons-material";
import { useFormik } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { StyledTextField, StyledDatePicker } from "../../pages/register/styles";
import { useOfertas } from "../../hooks/useOfertas";
import type { Factura } from "../../types/factura";
import ConfirmarOfertaModal from "../Modals/ConfirmarOfertaModal";
import ResumenOfertaAside from "./ResumenOfertaAside";
import SectionPanel from "../SectionPanel";
import { formatMoney } from "../../utils/ofertaFormatters";
import { computeOfertaMontos } from "../../utils/ofertaCalculations";
import {
  createOfertaFormSchema,
  handleDecimalRateInputChange,
  handleNonNegativeIntegerInputChange,
  TASA_DIARIA_MORA_RANGE_MESSAGE,
  TASA_RANGE_MESSAGE,
} from "../../utils/validations/oferta-fields";

const COMPUTED_MONEY_FIELDS = [
  { key: "ivaComision", label: "IVA comisión" },
  { key: "montoAFinanciar", label: "Monto a financiar" },
  { key: "retencion", label: "Retención" },
  { key: "costoFinanciamiento", label: "Costo de financiamiento" },
  { key: "precioCompra", label: "Precio de compra" },
  { key: "montoAGirar", label: "Monto a girar", emphasize: true },
] as const;

const REQUIRED_MONEY_FIELDS = [
  { name: "saldoPendiente", label: "Saldo pendiente" },
  { name: "montoComision", label: "Monto de comisión" },
  { name: "gastosAdministrativos", label: "Gastos administrativos" },
  { name: "firmaDigital", label: "Firma digital" },
] as const;

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

interface EnviarOfertaCardProps {
  factura: Factura;
  factoringId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
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
  onCancel,
}: EnviarOfertaCardProps) => {
  const { createOferta, loading } = useOfertas();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openPicker, setOpenPicker] = useState<
    "fechaExpiracion" | "fechaCotizacion" | null
  >(null);
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [alertMessage, setAlertMessage] = useState("");

  const diasFinanciamiento = factura.plazo || 0;

  const formik = useFormik({
    initialValues: {
      porcentajeFinanciamiento: 100 as number | string,
      fechaCotizacion: today as Date | null,
      tasa30Dias: 0 as number | string,
      saldoPendiente: "0",
      montoComision: "",
      gastosAdministrativos: "",
      firmaDigital: "0",
      tasaDiariaMora: 0 as number | string,
      cobroPorDiaMora: "0",
      fechaExpiracion: null as Date | null,
      comentario: "",
      ofertaCondicionada: false,
    },
    validationSchema: createOfertaFormSchema(tomorrow),
    onSubmit: () => {
      setConfirmOpen(true);
    },
  });

  const montosCalculados = useMemo(
    () =>
      computeOfertaMontos({
        montoTotal: factura.montoTotal,
        porcentajeFinanciamiento: formik.values.porcentajeFinanciamiento,
        diasFinanciamiento,
        tasa30Dias: formik.values.tasa30Dias,
        saldoPendiente: formik.values.saldoPendiente,
        montoComision: formik.values.montoComision,
        gastosAdministrativos: formik.values.gastosAdministrativos,
        firmaDigital: formik.values.firmaDigital,
      }),
    [
      factura.montoTotal,
      formik.values.porcentajeFinanciamiento,
      diasFinanciamiento,
      formik.values.tasa30Dias,
      formik.values.saldoPendiente,
      formik.values.montoComision,
      formik.values.gastosAdministrativos,
      formik.values.firmaDigital,
    ],
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
        diasFinanciamiento,
        porcentajeFinanciamiento: formik.values.porcentajeFinanciamiento,
        fechaCotizacion: formik.values.fechaCotizacion!,
        montoAFinanciar: montosCalculados.montoAFinanciar,
        tasa30Dias: formik.values.tasa30Dias,
        retencion: montosCalculados.retencion,
        costoFinanciamiento: montosCalculados.costoFinanciamiento,
        precioCompra: montosCalculados.precioCompra,
        saldoPendiente: formik.values.saldoPendiente,
        montoComision: formik.values.montoComision,
        ivaComision: montosCalculados.ivaComision,
        gastosAdministrativos: formik.values.gastosAdministrativos,
        firmaDigital: formik.values.firmaDigital,
        montoAGirar: montosCalculados.montoAGirar,
        tasaDiariaMora: formik.values.tasaDiariaMora,
        cobroPorDiaMora: formik.values.cobroPorDiaMora,
        fechaExpiracion: formik.values.fechaExpiracion!,
        comentario: formik.values.comentario,
        ofertaCondicionada: formik.values.ofertaCondicionada,
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
    name: "fechaExpiracion" | "fechaCotizacion",
    label: string,
    fallbackHelper: string,
    minDate?: Date,
    required = false,
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
          required,
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
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 340px" },
            gap: 3,
            alignItems: "start",
            mb: 3,
          }}
        >
          <SectionPanel
            title="Condiciones de tu oferta"
            icon={<Send sx={{ color: "primary.main", fontSize: 24 }} />}
          >
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
              <Tooltip
                title="Este campo no puede ser editado. El plazo es definido por la empresa emisora."
                arrow
              >
                <StyledTextField
                  fullWidth
                  label="Días de financiamiento"
                  value={diasFinanciamiento}
                  InputProps={{ readOnly: true }}
                  helperText={`Plazo solicitado: ${diasFinanciamiento} días`}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      cursor: "not-allowed",
                      "& input": { cursor: "not-allowed" },
                    },
                  }}
                />
              </Tooltip>

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

              {renderDatePicker(
                "fechaCotizacion",
                "Fecha de cotización",
                "Fecha de la cotización",
              )}

              <StyledTextField
                fullWidth
                name="tasa30Dias"
                label="Tasa 30 días (%)"
                type="string"
                inputProps={{ min: 0, max: 100, step: 0.01 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                value={formik.values.tasa30Dias}
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
                error={fieldError("tasa30Dias")}
                helperText={fieldHelper("tasa30Dias", TASA_RANGE_MESSAGE)}
              />

              {REQUIRED_MONEY_FIELDS.map((field) => (
                <StyledTextField
                  key={field.name}
                  fullWidth
                  name={field.name}
                  label={field.label}
                  type="string"
                  inputMode="numeric"
                  required
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
                  inputProps={{ maxLength: 50 }}
                  error={fieldError(field.name)}
                  helperText={fieldHelper(field.name, "Mayor o igual a 0")}
                />
              ))}

              <StyledTextField
                fullWidth
                name="tasaDiariaMora"
                label="Tasa diaria de mora (%)"
                type="string"
                required
                inputProps={{ min: 0, max: 100, step: 0.01 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                value={formik.values.tasaDiariaMora}
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
                error={fieldError("tasaDiariaMora")}
                helperText={fieldHelper(
                  "tasaDiariaMora",
                  TASA_DIARIA_MORA_RANGE_MESSAGE,
                )}
              />

              <StyledTextField
                fullWidth
                name="cobroPorDiaMora"
                label="Cobro por día de mora"
                type="string"
                inputMode="numeric"
                required
                value={formik.values.cobroPorDiaMora}
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
                inputProps={{ maxLength: 50 }}
                error={fieldError("cobroPorDiaMora")}
                helperText={fieldHelper("cobroPorDiaMora", "Mayor o igual a 0")}
              />

              {renderDatePicker(
                "fechaExpiracion",
                "Fecha de expiración",
                "Fecha límite para que la empresa acepte",
                tomorrow,
                true,
              )}
            </Box>

            <Typography variant="subtitle1" sx={sectionTitleSx}>
              Montos calculados
            </Typography>
            <Box sx={{ ...gridSx, mb: 1 }}>
              {COMPUTED_MONEY_FIELDS.map((field) => {
                const emphasize = "emphasize" in field && field.emphasize;
                return (
                  <StyledTextField
                    key={field.key}
                    fullWidth
                    label={field.label}
                    value={formatMoney(montosCalculados[field.key])}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        cursor: "not-allowed",
                        "& input": {
                          cursor: "not-allowed",
                          ...(emphasize
                            ? { color: "primary.main", fontWeight: 600 }
                            : {}),
                        },
                      },
                    }}
                    helperText="Calculado automáticamente"
                  />
                );
              })}
            </Box>

            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "text.primary", mb: 0.5, mt: 1 }}
            >
              Comentario
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-default-secondary)", mb: 2 }}
            >
              Información adicional sobre tu oferta (opcional)
            </Typography>
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

            <FormControlLabel
              control={
                <Checkbox
                  id="ofertaCondicionada"
                  name="ofertaCondicionada"
                  checked={formik.values.ofertaCondicionada}
                  onChange={formik.handleChange}
                  disabled={loading || alertStatus === "success"}
                  size="small"
                />
              }
              label={
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "var(--color-fg-default-primary)",
                    }}
                  >
                    Oferta condicionada
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--color-fg-default-secondary)" }}
                  >
                    Mi oferta está sujeta a condiciones o antecedentes
                    adicionales.
                  </Typography>
                </Box>
              }
              sx={{
                mt: 2,
                mx: 0,
                p: 2,
                alignItems: "flex-start",
                gap: 1,
                borderRadius: 2,
                border: "1px solid var(--color-border-default-primary)",
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                mt: 1,
                p: 2,
                borderRadius: 2,
                backgroundColor: "var(--color-bg-accent-secondary)",
              }}
            >
              <InfoOutlined
                sx={{
                  color: "var(--color-fg-accent-primary)",
                  mt: 0.25,
                  flexShrink: 0,
                }}
              />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: "var(--color-fg-default-primary)",
                  }}
                >
                  Importante
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--color-fg-default-secondary)" }}
                >
                  La empresa revisará tu oferta antes de aceptarla. Podrás
                  seguir el estado desde el Marketplace.
                </Typography>
              </Box>
            </Box>
          </SectionPanel>

          <ResumenOfertaAside
            montoTotal={factura.montoTotal}
            porcentajeFinanciamiento={formik.values.porcentajeFinanciamiento}
            montoAFinanciar={montosCalculados.montoAFinanciar}
            montoAGirar={montosCalculados.montoAGirar}
            tasa30Dias={formik.values.tasa30Dias}
            diasFinanciamiento={diasFinanciamiento}
            fechaExpiracion={formik.values.fechaExpiracion}
            submitDisabled={
              alertStatus === "success" ||
              !formik.isValid ||
              !formik.dirty ||
              !formik.values.fechaExpiracion ||
              !formik.values.fechaCotizacion
            }
            onCancel={onCancel}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            pb: 1,
          }}
        >
          <Lock
            sx={{ fontSize: 16, color: "var(--color-fg-default-tertiary)" }}
          />
          <Typography
            variant="caption"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            Tu oferta es confidencial y solo será visible para la empresa cuando
            la envíes
          </Typography>
        </Box>
      </Box>

      <ConfirmarOfertaModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
        ofertaCondicionada={formik.values.ofertaCondicionada}
      />
    </LocalizationProvider>
  );
};

export default EnviarOfertaCard;
