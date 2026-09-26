import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Drawer,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Close,
  Description,
  InfoOutlined,
  Send,
} from "@mui/icons-material";
import { useFormik } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { StyledDatePicker, StyledTextField } from "../../pages/register/styles";
import type { Factura } from "../../types/factura";
import { formatCurrency } from "./FacturaResumenCard";
import {
  buildOfertaGrupalBorradores,
  buildOfertaGrupalInitialValues,
  buildOfertaGrupalPreview,
  sumFacturasMontoTotal,
  type OfertaGrupoBorrador,
  type OfertaGrupoFormValues,
} from "../../utils/facturaGrupoOferta";
import { montoAGirarEsNegativo } from "../../utils/ofertaCalculations";
import {
  createOfertaFormSchema,
  handleDecimalRateInputChange,
  handleNonNegativeIntegerInputChange,
  TASA_DIARIA_MORA_RANGE_MESSAGE,
  TASA_RANGE_MESSAGE,
} from "../../utils/validations/oferta-fields";

const MONEY_FIELDS = [
  { name: "montoComision" as const, label: "Monto de comisión" },
  { name: "gastosAdministrativos" as const, label: "Gastos administrativos" },
];

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

const requiredAsteriskSx = {
  "& .MuiFormLabel-asterisk": {
    color: "var(--color-fg-danger-primary)",
  },
};

const gridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
  gap: 2,
};

const headerCellSx = {
  fontWeight: 600,
  color: "var(--color-fg-default-secondary)",
  whiteSpace: "nowrap",
} as const;

const isFormComplete = (values: OfertaGrupoFormValues, isValid: boolean) =>
  isValid &&
  Boolean(values.fechaCotizacion) &&
  Boolean(values.vigenciaOfertaDias) &&
  values.montoComision !== "" &&
  values.gastosAdministrativos !== "" &&
  values.diasFinanciamiento !== "" &&
  values.porcentajeFinanciamiento !== "";

type FacturaGrupoOfertaGrupalDrawerProps = {
  open: boolean;
  onClose: () => void;
  facturas: Factura[];
  factoringId: string;
  plazo?: number | null;
  sending?: boolean;
  error?: string | null;
  errorReason?: string | null;
  onCreate: (borradores: OfertaGrupoBorrador[]) => void | Promise<void>;
};

const StepHeading = ({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle?: string;
}) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        backgroundColor: "var(--color-bg-accent-primary)",
        color: "var(--color-fg-on-accent-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 14,
        flexShrink: 0,
      }}
    >
      {step}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          sx={{ color: "var(--color-fg-default-secondary)" }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  </Box>
);

const OfertaGrupalForm = ({
  facturas,
  factoringId,
  plazo,
  sending = false,
  error,
  errorReason,
  onClose,
  onCreate,
}: Omit<FacturaGrupoOfertaGrupalDrawerProps, "open">) => {
  const [openPicker, setOpenPicker] = useState(false);
  const montoTotalSeleccionado = useMemo(
    () => sumFacturasMontoTotal(facturas),
    [facturas],
  );

  const formik = useFormik<OfertaGrupoFormValues>({
    validateOnMount: true,
    initialValues: buildOfertaGrupalInitialValues(plazo),
    validationSchema: createOfertaFormSchema(),
    onSubmit: async (values) => {
      if (sending || facturas.length === 0) return;
      const previewRows = buildOfertaGrupalPreview(facturas, values);
      if (previewRows.some((row) => montoAGirarEsNegativo(row.montoAGirar))) {
        return;
      }
      const borradores = buildOfertaGrupalBorradores(
        facturas,
        factoringId,
        values,
      );
      if (!borradores?.length) return;
      await onCreate(borradores);
    },
  });

  const preview = useMemo(
    () => buildOfertaGrupalPreview(facturas, formik.values),
    [facturas, formik.values],
  );

  const filasMontoNegativo = preview.filter((row) =>
    montoAGirarEsNegativo(row.montoAGirar),
  );

  const canSubmit =
    isFormComplete(formik.values, formik.isValid) &&
    facturas.length > 0 &&
    filasMontoNegativo.length === 0 &&
    !sending;

  const fieldError = (name: keyof OfertaGrupoFormValues) =>
    Boolean(formik.touched[name] && formik.errors[name]);

  const fieldHelper = (name: keyof OfertaGrupoFormValues, fallback: string) =>
    formik.touched[name] ? (formik.errors[name] as string) || fallback : fallback;

  const diasHelper = plazo
    ? `Mínimo 1 día. Plazo del grupo: ${plazo} días`
    : "Mínimo 1 día";

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          ...requiredAsteriskSx,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <Box sx={{ flex: 1, overflow: "auto", pr: 0.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              mb: 3,
              p: 2,
              borderRadius: "var(--radius-m)",
              border: "1px solid var(--color-border-default-primary)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Description
                sx={{ color: "var(--color-fg-accent-primary)", fontSize: 22 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {facturas.length} factura{facturas.length === 1 ? "" : "s"}{" "}
                seleccionada{facturas.length === 1 ? "" : "s"}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="caption"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
                Monto total seleccionado
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {formatCurrency(montoTotalSeleccionado)}
              </Typography>
            </Box>
          </Box>

          <StepHeading step={1} title="Condiciones de la oferta" />
          <Box sx={{ ...gridSx, mb: 2 }}>
            <StyledTextField
              fullWidth
              name="diasFinanciamiento"
              label="Días de financiamiento"
              type="string"
              inputMode="numeric"
              required
              disabled={sending}
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
              helperText={fieldHelper("diasFinanciamiento", diasHelper)}
            />

            <StyledTextField
              fullWidth
              name="porcentajeFinanciamiento"
              label="Porcentaje de financiamiento (%)"
              type="string"
              required
              disabled={sending}
              inputProps={{ min: 1, max: 100, step: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
              name="tasa30Dias"
              label="Tasa 30 días (%)"
              type="string"
              required
              disabled={sending}
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
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

            {MONEY_FIELDS.map((field) => (
              <StyledTextField
                key={field.name}
                fullWidth
                name={field.name}
                label={field.label}
                type="string"
                inputMode="numeric"
                required
                disabled={sending}
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
              name="vigenciaOfertaDias"
              label="Días de vigencia de la oferta"
              type="string"
              inputMode="numeric"
              required
              disabled={sending}
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

            <StyledDatePicker
              label="Fecha de cotización"
              value={formik.values.fechaCotizacion}
              disabled={sending}
              open={openPicker}
              onOpen={() => setOpenPicker(true)}
              onClose={() => {
                setOpenPicker(false);
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
                  onClick: () => {
                    if (!sending) setOpenPicker(true);
                  },
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
              name="tasaDiariaMora"
              label="Tasa diaria de mora (%)"
              type="string"
              required
              disabled={sending}
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
              name="saldoPendiente"
              label="Saldo pendiente"
              type="string"
              inputMode="numeric"
              disabled={sending}
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

          <FormControlLabel
            control={
              <Checkbox
                name="ofertaCondicionada"
                checked={formik.values.ofertaCondicionada}
                disabled={sending}
                onChange={(_, checked) => {
                  void (async () => {
                    await formik.setFieldValue("ofertaCondicionada", checked);
                    if (checked) {
                      await formik.setFieldTouched("comentario", true, false);
                    }
                    await formik.validateForm({
                      ...formik.values,
                      ofertaCondicionada: checked,
                    });
                  })();
                }}
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
                  Esta oferta estará sujeta a condiciones o antecedentes
                  adicionales.
                </Typography>
              </Box>
            }
            sx={{
              mx: 0,
              mb: 2,
              p: 2,
              alignItems: "flex-start",
              gap: 1,
              borderRadius: "var(--radius-m)",
              border: "1px solid var(--color-border-default-primary)",
            }}
          />

          <StyledTextField
            fullWidth
            name="comentario"
            label={
              formik.values.ofertaCondicionada
                ? "Comentario general"
                : "Comentario general (opcional)"
            }
            placeholder="Agrega un comentario para la empresa"
            multiline
            rows={3}
            required={formik.values.ofertaCondicionada}
            disabled={sending}
            inputProps={{ maxLength: 500 }}
            value={formik.values.comentario}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("comentario")}
            helperText={fieldHelper(
              "comentario",
              formik.values.ofertaCondicionada
                ? "El comentario es obligatorio en ofertas condicionadas"
                : " ",
            )}
          />
          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "right",
              color: "var(--color-fg-default-tertiary)",
              mt: 0.5,
              mb: 3,
            }}
          >
            {formik.values.comentario.length}/500
          </Typography>

          <StepHeading
            step={2}
            title="Vista previa de la oferta por factura"
            subtitle="Así quedará la oferta en cada factura seleccionada."
          />
          <TableContainer
            sx={{
              border: "1px solid var(--color-border-default-primary)",
              borderRadius: "var(--radius-m)",
              mb: 2,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{ backgroundColor: "var(--color-bg-default-tertiary)" }}
                >
                  <TableCell sx={headerCellSx}>Folio</TableCell>
                  <TableCell sx={headerCellSx}>Monto total</TableCell>
                  <TableCell sx={headerCellSx}>Monto a financiar</TableCell>
                  <TableCell sx={headerCellSx}>Comisión</TableCell>
                  <TableCell sx={headerCellSx}>Monto a girar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {preview.map((row) => (
                  <TableRow key={row.facturaId}>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "var(--color-fg-accent-primary)",
                          fontWeight: 600,
                        }}
                      >
                        #{row.folio}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatCurrency(row.montoTotal)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(row.montoAFinanciar)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatCurrency(row.montoComision)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: montoAGirarEsNegativo(row.montoAGirar)
                            ? "var(--color-fg-danger-primary)"
                            : undefined,
                        }}
                      >
                        {formatCurrency(row.montoAGirar)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filasMontoNegativo.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              El monto a girar no puede ser negativo en{" "}
              {filasMontoNegativo.map((row) => `#${row.folio}`).join(", ")}.
              Comisión, IVA, gastos administrativos y saldo pendiente superan
              el precio de compra. Baja esos montos o quita
              {filasMontoNegativo.length === 1
                ? " esa factura"
                : " esas facturas"}{" "}
              de la selección.
            </Alert>
          )}

          <Alert
            severity="info"
            icon={<InfoOutlined fontSize="inherit" />}
            sx={{
              mb: 2,
              backgroundColor: "var(--color-bg-accent-secondary)",
              color: "var(--color-fg-default-primary)",
              "& .MuiAlert-icon": {
                color: "var(--color-fg-accent-primary)",
              },
            }}
          >
            Los valores pueden variar si editas las condiciones de la oferta.
            Revisa la vista previa antes de crear la oferta.
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {error}
              </Typography>
              {errorReason && (
                <Typography variant="body2" sx={{ mt: 0.75 }}>
                  {errorReason}
                </Typography>
              )}
            </Alert>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            pt: 2,
            mt: 1,
            borderTop: "1px solid var(--color-border-default-primary)",
            flexShrink: 0,
          }}
        >
          <Button
            type="button"
            onClick={onClose}
            disabled={sending}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "var(--color-fg-default-secondary)",
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!canSubmit}
            startIcon={
              sending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Send />
              )
            }
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "var(--color-fg-on-accent-primary)",
              backgroundColor: "var(--color-bg-accent-primary)",
              "&:hover": {
                backgroundColor: "var(--color-bg-accent-primary-hover)",
              },
              "&:disabled": {
                backgroundColor: "var(--color-bg-disabled-primary)",
                color: "var(--color-fg-disabled-primary)",
              },
            }}
          >
            Crear oferta grupal
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

const FacturaGrupoOfertaGrupalDrawer = ({
  open,
  onClose,
  sending = false,
  ...formProps
}: FacturaGrupoOfertaGrupalDrawerProps) => {
  const handleClose = () => {
    if (sending) return;
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={sending}
      slotProps={{
        backdrop: {
          sx: sending ? { pointerEvents: "auto" } : undefined,
        },
      }}
      PaperProps={{
        sx: {
          width: { xs: "100%", md: 720 },
          maxWidth: "100%",
          p: { xs: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
          flexShrink: 0,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "var(--color-fg-default-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Crear oferta grupal
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-secondary)", mt: 0.5 }}
          >
            Configura una oferta general que se aplicará a las facturas
            seleccionadas del grupo.
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          aria-label="Cerrar"
          size="small"
          disabled={sending}
        >
          <Close />
        </IconButton>
      </Box>

      {open && (
        <OfertaGrupalForm
          {...formProps}
          sending={sending}
          onClose={handleClose}
        />
      )}
    </Drawer>
  );
};

export default FacturaGrupoOfertaGrupalDrawer;
