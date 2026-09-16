import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  InputAdornment,
  Typography,
  Button,
} from "@mui/material";
import { InfoOutlined, Save } from "@mui/icons-material";
import { useFormik } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { StyledTextField, StyledDatePicker } from "../../pages/register/styles";
import type { Factura } from "../../types/factura";
import type { OfertaGrupoBorrador } from "../../utils/facturaGrupoOferta";
import { computeOfertaMontos } from "../../utils/ofertaCalculations";
import { formatMoney, parseDateOnly } from "../../utils/ofertaFormatters";
import {
  clearZeroOnFocus,
  createOfertaFormSchema,
  handleDecimalRateInputChange,
  handleNonNegativeIntegerInputChange,
  TASA_DIARIA_MORA_RANGE_MESSAGE,
  TASA_RANGE_MESSAGE,
} from "../../utils/validations/oferta-fields";
import ResumenOfertaAside from "./ResumenOfertaAside";
import SectionPanel from "../SectionPanel";

const COMPUTED_MONEY_FIELDS = [
  { key: "ivaComision", label: "IVA comisión" },
  { key: "montoAFinanciar", label: "Monto a financiar" },
  { key: "retencion", label: "Retención" },
  { key: "costoFinanciamiento", label: "Costo de financiamiento" },
  { key: "precioCompra", label: "Precio de compra" },
  { key: "montoAGirar", label: "Monto a girar", emphasize: true },
] as const;

const MONEY_FIELDS = [
  { name: "montoComision", label: "Monto de comisión", required: true },
  {
    name: "gastosAdministrativos",
    label: "Gastos administrativos",
    required: true,
  },
] as const;

const today = new Date();

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

const requiredAsteriskSx = {
  "& .MuiFormLabel-asterisk": {
    color: "var(--color-fg-danger-primary)",
  },
};

type FacturaGrupoOfertaFormProps = {
  factura: Factura;
  factoringId: string;
  borrador?: OfertaGrupoBorrador | null;
  onSave: (borrador: OfertaGrupoBorrador) => void;
  onSaveSuccess?: () => void;
  onEnviarIndividual?: (borrador: OfertaGrupoBorrador) => void | Promise<void>;
  onDelete?: () => void;
  disabled?: boolean;
  sendingIndividual?: boolean;
};

const buildInitialValues = (
  factura: Factura,
  borrador?: OfertaGrupoBorrador | null,
) => {
  if (borrador) {
    return {
      diasFinanciamiento: borrador.diasFinanciamiento as number | string,
      porcentajeFinanciamiento:
        borrador.porcentajeFinanciamiento as number | string,
      fechaCotizacion:
        parseDateOnly(borrador.fechaCotizacion as string | Date) ?? today,
      tasa30Dias: borrador.tasa30Dias as number | string,
      montoComision: String(borrador.montoComision ?? ""),
      gastosAdministrativos: String(borrador.gastosAdministrativos ?? ""),
      saldoPendiente: String(borrador.saldoPendiente ?? "0"),
      tasaDiariaMora: borrador.tasaDiariaMora as number | string,
      vigenciaOfertaDias: borrador.vigenciaOfertaDias as number | string,
      comentario: borrador.comentario ?? "",
      ofertaCondicionada: Boolean(borrador.ofertaCondicionada),
    };
  }

  return {
    diasFinanciamiento: (factura.plazo || "") as number | string,
    porcentajeFinanciamiento: 100 as number | string,
    fechaCotizacion: today as Date | null,
    tasa30Dias: 0 as number | string,
    montoComision: "",
    gastosAdministrativos: "",
    saldoPendiente: "0",
    tasaDiariaMora: 0 as number | string,
    vigenciaOfertaDias: 3 as number | string,
    comentario: "",
    ofertaCondicionada: false,
  };
};

const buildBorradorFromValues = (
  factura: Factura,
  factoringId: string,
  values: ReturnType<typeof buildInitialValues>,
): OfertaGrupoBorrador | null => {
  if (!values.fechaCotizacion) return null;
  const montos = computeOfertaMontos({
    montoTotal: factura.montoTotal,
    porcentajeFinanciamiento: values.porcentajeFinanciamiento,
    diasFinanciamiento: values.diasFinanciamiento,
    tasa30Dias: values.tasa30Dias,
    saldoPendiente: values.saldoPendiente,
    montoComision: values.montoComision,
    gastosAdministrativos: values.gastosAdministrativos,
  });

  return {
    facturaId: factura.id,
    factoringId,
    diasFinanciamiento: values.diasFinanciamiento,
    porcentajeFinanciamiento: values.porcentajeFinanciamiento,
    fechaCotizacion: values.fechaCotizacion,
    montoAFinanciar: montos.montoAFinanciar,
    tasa30Dias: values.tasa30Dias,
    retencion: montos.retencion,
    costoFinanciamiento: montos.costoFinanciamiento,
    precioCompra: montos.precioCompra,
    saldoPendiente: values.saldoPendiente || "0",
    montoComision: values.montoComision,
    ivaComision: montos.ivaComision,
    gastosAdministrativos: values.gastosAdministrativos,
    montoAGirar: montos.montoAGirar,
    tasaDiariaMora: values.tasaDiariaMora,
    vigenciaOfertaDias: values.vigenciaOfertaDias,
    comentario: values.comentario,
    ofertaCondicionada: values.ofertaCondicionada,
  };
};

const FacturaGrupoOfertaForm = ({
  factura,
  factoringId,
  borrador,
  onSave,
  onSaveSuccess,
  onEnviarIndividual,
  onDelete,
  disabled = false,
  sendingIndividual = false,
}: FacturaGrupoOfertaFormProps) => {
  const [openPicker, setOpenPicker] = useState<"fechaCotizacion" | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const hasBorrador = Boolean(borrador);

  const formik = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: buildInitialValues(factura, borrador),
    validationSchema: createOfertaFormSchema(),
    onSubmit: (values) => {
      const next = buildBorradorFromValues(factura, factoringId, values);
      if (!next) return;
      onSave(next);
      onSaveSuccess?.();
    },
  });

  const montosCalculados = useMemo(
    () =>
      computeOfertaMontos({
        montoTotal: factura.montoTotal,
        porcentajeFinanciamiento: formik.values.porcentajeFinanciamiento,
        diasFinanciamiento: formik.values.diasFinanciamiento,
        tasa30Dias: formik.values.tasa30Dias,
        saldoPendiente: formik.values.saldoPendiente,
        montoComision: formik.values.montoComision,
        gastosAdministrativos: formik.values.gastosAdministrativos,
      }),
    [
      factura.montoTotal,
      formik.values.porcentajeFinanciamiento,
      formik.values.diasFinanciamiento,
      formik.values.tasa30Dias,
      formik.values.saldoPendiente,
      formik.values.montoComision,
      formik.values.gastosAdministrativos,
    ],
  );

  const isFormComplete =
    formik.isValid &&
    Boolean(formik.values.fechaCotizacion) &&
    Boolean(formik.values.vigenciaOfertaDias) &&
    formik.values.montoComision !== "" &&
    formik.values.gastosAdministrativos !== "" &&
    formik.values.diasFinanciamiento !== "" &&
    formik.values.porcentajeFinanciamiento !== "";

  const actionsDisabled = disabled || sendingIndividual || !isFormComplete;

  const handleEnviarIndividual = async () => {
    if (!onEnviarIndividual || disabled || sendingIndividual) return;
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched(
        Object.fromEntries(
          Object.keys(formik.values).map((key) => [key, true]),
        ) as typeof formik.touched,
      );
      return;
    }
    const next = buildBorradorFromValues(
      factura,
      factoringId,
      formik.values,
    );
    if (!next) return;
    await onEnviarIndividual(next);
  };

  const fieldError = (name: keyof typeof formik.values) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const fieldHelper = (name: keyof typeof formik.values, fallback: string) =>
    formik.touched[name]
      ? (formik.errors[name] as string) || fallback
      : fallback;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={requiredAsteriskSx}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 300px" },
            gap: 3,
            alignItems: "start",
            mb: 2,
          }}
        >
          <SectionPanel
            title="Tu oferta para esta factura"
            icon={<Save sx={{ color: "primary.main", fontSize: 24 }} />}
          >
            {hasBorrador && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Borrador guardado. Puedes seguir editando o eliminarlo antes de
                enviar la oferta.
              </Alert>
            )}

            <Typography variant="subtitle1" sx={sectionTitleSx}>
              Condiciones de financiamiento
            </Typography>
            <Box sx={{ ...gridSx, mb: 1 }}>
              <StyledTextField
                fullWidth
                name="diasFinanciamiento"
                label="Días de financiamiento"
                type="string"
                inputMode="numeric"
                required
                value={formik.values.diasFinanciamiento}
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
                error={fieldError("diasFinanciamiento")}
                helperText={fieldHelper(
                  "diasFinanciamiento",
                  `Mínimo 1 día. Plazo solicitado: ${factura.plazo || 0} días`,
                )}
              />

              <StyledTextField
                fullWidth
                name="porcentajeFinanciamiento"
                label="Porcentaje de financiamiento (%)"
                type="string"
                required
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

              <StyledDatePicker
                label="Fecha de cotización"
                value={formik.values.fechaCotizacion}
                open={openPicker === "fechaCotizacion"}
                onOpen={() => setOpenPicker("fechaCotizacion")}
                onClose={() => {
                  setOpenPicker(null);
                  formik.setFieldTouched("fechaCotizacion", true, false);
                }}
                onChange={(value) => {
                  formik.setFieldValue("fechaCotizacion", value, true);
                  formik.setFieldTouched("fechaCotizacion", true, false);
                }}
                onAccept={() =>
                  formik.setFieldTouched("fechaCotizacion", true, false)
                }
                format="dd/MM/yyyy"
                slotProps={{
                  field: { readOnly: true },
                  openPickerButton: { tabIndex: -1 },
                  textField: {
                    fullWidth: true,
                    required: true,
                    onClick: () => setOpenPicker("fechaCotizacion"),
                    onKeyDown: (e) => e.preventDefault(),
                    onBlur: () =>
                      formik.setFieldTouched("fechaCotizacion", true, false),
                    error: fieldError("fechaCotizacion"),
                    helperText: fieldHelper(
                      "fechaCotizacion",
                      "Fecha de la cotización",
                    ),
                    sx: {
                      ...requiredAsteriskSx,
                      cursor: "pointer",
                      "& .MuiOutlinedInput-root": {
                        cursor: "pointer",
                        "& input": { cursor: "pointer" },
                      },
                    },
                  },
                }}
              />

              <StyledTextField
                fullWidth
                name="tasa30Dias"
                label="Tasa 30 días (%)"
                type="string"
                required
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
                onFocus={() =>
                  clearZeroOnFocus(
                    "tasa30Dias",
                    formik.values.tasa30Dias,
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

              {MONEY_FIELDS.map((field) => (
                <StyledTextField
                  key={field.name}
                  fullWidth
                  name={field.name}
                  label={field.label}
                  type="string"
                  inputMode="numeric"
                  required={field.required}
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
                onFocus={() =>
                  clearZeroOnFocus(
                    "tasaDiariaMora",
                    formik.values.tasaDiariaMora,
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
                name="vigenciaOfertaDias"
                label="Días de vigencia"
                type="string"
                inputMode="numeric"
                required
                value={formik.values.vigenciaOfertaDias}
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
                error={fieldError("vigenciaOfertaDias")}
                helperText={fieldHelper(
                  "vigenciaOfertaDias",
                  "Mínimo 1 día, máximo 365",
                )}
              />

              <StyledTextField
                fullWidth
                name="saldoPendiente"
                label="Saldo pendiente"
                type="string"
                inputMode="numeric"
                value={formik.values.saldoPendiente}
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
                error={fieldError("saldoPendiente")}
                helperText={fieldHelper("saldoPendiente", "Mayor o igual a 0")}
              />
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
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  id="ofertaCondicionada"
                  name="ofertaCondicionada"
                  checked={formik.values.ofertaCondicionada}
                  onChange={formik.handleChange}
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
                mt: 3,
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
              <Typography
                variant="body2"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
                Guardar borrador deja la oferta localmente. También puedes
                enviar esta factura de forma individual o usar &quot;Enviar
                oferta al grupo&quot; con todos los borradores pendientes.
              </Typography>
            </Box>
          </SectionPanel>

          <ResumenOfertaAside
            montoTotal={factura.montoTotal}
            porcentajeFinanciamiento={formik.values.porcentajeFinanciamiento}
            montoAFinanciar={montosCalculados.montoAFinanciar}
            montoAGirar={montosCalculados.montoAGirar}
            tasa30Dias={formik.values.tasa30Dias}
            diasFinanciamiento={formik.values.diasFinanciamiento}
            vigenciaOfertaDias={formik.values.vigenciaOfertaDias}
            submitLabel="Guardar borrador"
            submitDisabled={actionsDisabled}
            showDelete={hasBorrador}
            onDelete={() => setDeleteConfirmOpen(true)}
            deleteDisabled={disabled || sendingIndividual}
            secondarySubmitLabel="Enviar oferta individual"
            onSecondarySubmit={() => {
              void handleEnviarIndividual();
            }}
            secondarySubmitDisabled={actionsDisabled}
          />
        </Box>
      </Box>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "var(--radius-l)" } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Eliminar borrador</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Eliminar el borrador de la factura #{factura.folio}? Esta acción no
            se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setDeleteConfirmOpen(false);
              onDelete?.();
            }}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "var(--color-fg-on-accent-primary)",
              backgroundColor: "var(--color-bg-danger-primary)",
              "&:hover": {
                backgroundColor: "var(--color-bg-danger-primary-hover)",
              },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default FacturaGrupoOfertaForm;
