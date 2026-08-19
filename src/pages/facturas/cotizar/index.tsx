import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Slider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";
import {
  Description,
  ArrowBack,
  ErrorOutline,
  CheckCircle,
  Send,
  Check,
  Visibility,
} from "@mui/icons-material";
import Layout from "../../../components/Layout";
import type { Factura } from "../../../types/factura";
import type { Factoring } from "../../../types/factoring";
import { useFacturas } from "../../../hooks/useFacturas";
import { useFactoring } from "../../../hooks/useFactoring";
import UploadXmlModal from "../../../components/Modals/UploadXmlModal";
import FacturaResumenCard, {
  formatCurrency,
} from "../../../components/Facturas/FacturaResumenCard";
import FactoringsList from "../../../components/Facturas/FactoringsList";
import DocumentosAsociadosCard from "../../../components/Facturas/DocumentosAsociadosCard";
import { appContentSx } from "../../../theme/layoutStyles";
import { isXmlUiEnabled } from "../../../config/featureFlags";
import {
  hasFacturaPdf,
  hasFacturaXml,
  shouldBlockForMissingXml,
} from "../../../utils/facturaDocuments";

const getCotizarSteps = () =>
  isXmlUiEnabled()
    ? ["Resumen Factura", "XML + Condiciones", "Resumen Final"]
    : ["Resumen Factura", "Documentos + Condiciones", "Resumen Final"];

const truncateToTwo = (num: number): number => {
  return Math.round(num * 100) / 100;
};

const MIN_PLAZO = 1;
const MAX_PLAZO = 180;

const CotizarFactura = () => {
  const {
    getFacturaById,
    updateFactura,
    sendToMarketplace,
    refreshFactura,
    loading,
  } = useFacturas();
  const { getAllFactorings, loading: loadingFactorings } = useFactoring();
  const { id } = useParams();
  const navigate = useNavigate();

  const [factura, setFactura] = useState<Factura | null>(null);
  const [factorings, setFactorings] = useState<Factoring[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [uploadXmlModalOpen, setUploadXmlModalOpen] = useState(false);

  // Step 2 Form State
  const [montoFinanciar, setMontoFinanciar] = useState<number>(100);
  const [plazo, setPlazo] = useState<number>(1);
  const [step2Error, setStep2Error] = useState<string | null>(null);
  const [step2Success, setStep2Success] = useState<string | null>(null);
  const [savingStep2, setSavingStep2] = useState(false);

  // Step 3 State
  const [visibilidad, setVisibilidad] = useState<"TODOS" | "SELECCIONADOS">(
    "TODOS",
  );
  const [selectedFactorings, setSelectedFactorings] = useState<string[]>([]);
  const [step3Error, setStep3Error] = useState<string | null>(null);
  const [sendingToMarketplace, setSendingToMarketplace] = useState(false);

  const fetchFactura = async () => {
    try {
      setError(null);
      const data = await getFacturaById(id!);
      setFactura(data);

      // Initialize form values from factura
      if (data.montoTotal) {
        const percentage = data.montoFinanciar
          ? (parseFloat(data.montoFinanciar) / parseFloat(data.montoTotal)) * 100
          : 100;
        setMontoFinanciar(truncateToTwo(percentage));
      }
      if (data.plazo) {
        setPlazo(data.plazo);
      }
    } catch (err) {
      console.error("Error fetching factura:", err);
      setError("No se pudo cargar la factura. Por favor, intente nuevamente.");
    }
  };

  const fetchFactorings = async () => {
    try {
      const data = await getAllFactorings();
      setFactorings(data || []);
    } catch (err) {
      console.error("Error fetching factorings:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFactura();
      fetchFactorings();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      // Validate visibility selection before saving
      if (visibilidad === "SELECCIONADOS" && selectedFactorings.length === 0) {
        setStep2Error("Debe seleccionar al menos un Factoring");
        return;
      }
      handleSaveStep2();
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleUploadXmlSuccess = async () => {
    try {
      const data = await refreshFactura(id!);
      setFactura(data);
    } catch (err) {
      console.error("Error refreshing factura:", err);
    }
  };

  const handleDownloadXml = (base64: string, fileName: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = (base64: string, fileName: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Validations for Step 2
  const validateXmlMatch = () => {
    if (shouldBlockForMissingXml(factura)) {
      return {
        valid: false,
        message: "Debe subir el archivo XML de la factura",
      };
    }
    return { valid: true, message: "" };
  };

  const validatePdfUploaded = () => {
    if (!hasFacturaPdf(factura)) {
      return {
        valid: false,
        message: "Debe subir el archivo PDF de la factura",
      };
    }
    return { valid: true, message: "" };
  };

  const validateMontoFinanciar = () => {
    if (montoFinanciar < 1 || montoFinanciar > 100) {
      return {
        valid: false,
        message: "El monto a financiar debe estar entre 1% y 100%",
      };
    }
    return { valid: true, message: "" };
  };

  const validatePlazo = () => {
    if (plazo < MIN_PLAZO || plazo > MAX_PLAZO) {
      return {
        valid: false,
        message: `El plazo debe estar entre ${MIN_PLAZO} y ${MAX_PLAZO} días`,
      };
    }
    return { valid: true, message: "" };
  };

  const isStep2Valid = () => {
    const xmlValidation = validateXmlMatch();
    const pdfValidation = validatePdfUploaded();
    const montoValidation = validateMontoFinanciar();
    const plazoValidation = validatePlazo();
    const visibilidadValid =
      visibilidad === "TODOS" || selectedFactorings.length > 0;
    return (
      xmlValidation.valid &&
      pdfValidation.valid &&
      montoValidation.valid &&
      plazoValidation.valid &&
      visibilidadValid
    );
  };

  const handleSaveStep2 = async () => {
    if (!factura) return;

    setStep2Error(null);
    setStep2Success(null);

    // Validate all
    const xmlValidation = validateXmlMatch();
    if (!xmlValidation.valid) {
      setStep2Error(xmlValidation.message);
      return;
    }

    const pdfValidation = validatePdfUploaded();
    if (!pdfValidation.valid) {
      setStep2Error(pdfValidation.message);
      return;
    }

    const montoValidation = validateMontoFinanciar();
    if (!montoValidation.valid) {
      setStep2Error(montoValidation.message);
      return;
    }

    const plazoValidation = validatePlazo();
    if (!plazoValidation.valid) {
      setStep2Error(plazoValidation.message);
      return;
    }

    try {
      setSavingStep2(true);
      const calculatedMontoFinanciar = Math.trunc(
        (parseFloat(factura.montoTotal) * montoFinanciar) / 100,
      );

      await updateFactura(id!, {
        plazo,
        montoFinanciar: calculatedMontoFinanciar,
      });

      // Refresh factura to get updated values
      const updatedFactura = await refreshFactura(id!);
      setFactura(updatedFactura);

      setStep2Success("Condiciones guardadas correctamente");
      setActiveStep(2);
    } catch (err) {
      console.error("Error updating factura:", err);
      setStep2Error("Error al guardar las condiciones. Intente nuevamente.");
    } finally {
      setSavingStep2(false);
    }
  };

  const handleSendToMarketplace = async () => {
    if (!factura) return;

    setStep3Error(null);

    if (visibilidad === "SELECCIONADOS" && selectedFactorings.length === 0) {
      setStep3Error("Debe seleccionar al menos un Factoring");
      return;
    }

    try {
      setSendingToMarketplace(true);
      await sendToMarketplace(id!, {
        visibilidad,
        factoringIds: visibilidad === "TODOS" ? [] : selectedFactorings,
      });

      navigate("/facturas", {
        state: { successMessage: "Factura enviada a cotizar exitosamente" },
      });
    } catch (err) {
      console.error("Error sending to marketplace:", err);
      setStep3Error("Error al enviar a cotizar. Intente nuevamente.");
    } finally {
      setSendingToMarketplace(false);
    }
  };

  const calculatedMontoFinanciar = factura
    ? Math.round((parseFloat(factura.montoTotal) * montoFinanciar) / 100)
    : 0;

  // Loading state
  if (loading && !factura) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: "var(--color-fg-accent-primary)" }} />
          <Typography variant="body1" sx={{ color: "var(--color-fg-default-secondary)" }}>
            Cargando factura...
          </Typography>
        </Box>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <Box sx={appContentSx}>
          <IconButton onClick={handleBack} sx={{ mb: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
              gap: 2,
            }}
          >
            <ErrorOutline sx={{ fontSize: 64, color: "var(--color-fg-danger-primary)" }} />
            <Typography variant="h6" sx={{ color: "var(--color-fg-default-primary)", fontWeight: 600 }}>
              Error al cargar la factura
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{
                mt: 2,
                backgroundColor: "var(--color-bg-accent-primary)",
                "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
                textTransform: "none",
                color: "var(--color-fg-on-accent-primary)",
              }}
            >
              Reintentar
            </Button>
          </Box>
        </Box>
      </Layout>
    );
  }

  if (!factura) {
    return (
      <Layout>
        <Box sx={appContentSx}>
          <IconButton onClick={handleBack} sx={{ mb: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
              gap: 2,
            }}
          >
            <Description sx={{ fontSize: 64, color: "var(--color-fg-default-tertiary)" }} />
            <Typography variant="h6" sx={{ color: "var(--color-fg-default-secondary)" }}>
              Factura no encontrada
            </Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  const showSolicitudFields = factura.estado?.toLowerCase() !== "cargada";
  const steps = getCotizarSteps();
  const showXmlUi = isXmlUiEnabled();

  return (
    <Layout>
      <Box sx={appContentSx}>
        {/* Back Button */}
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{
              color: "var(--color-fg-default-secondary)",
              textTransform: "none",
              "&:hover": { backgroundColor: "var(--color-bg-default-tertiary)" },
            }}
          >
            Volver a facturas
          </Button>
        </Box>

        {/* Header with Title */}
        <Box
          sx={{
            backgroundColor: "var(--color-bg-default-primary)",
            borderRadius: 3,
            p: 3,
            mb: 3,
            boxShadow: "var(--shadow-popover)",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)", mb: 3 }}
          >
            Cotizar Factura #{factura.folio}
          </Typography>

          {/* Stepper */}
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
                fill: "var(--color-fg-on-accent-primary)",
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={label} completed={index < activeStep}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontWeight: index === activeStep ? 600 : 400,
                      color: index === activeStep ? "var(--color-fg-accent-primary)" : "var(--color-fg-default-secondary)",
                    },
                    "& .MuiStepIcon-root": {
                      color: index <= activeStep ? "var(--color-fg-accent-primary)" : "var(--color-fg-default-tertiary)",
                      "&.Mui-completed": { color: "var(--color-fg-success-primary)" },
                      "&.Mui-active": { color: "var(--color-fg-accent-primary)" },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step Content */}
        {activeStep === 0 && (
          <>
            <FacturaResumenCard
              factura={factura}
              showSolicitudFields={showSolicitudFields}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  backgroundColor: "var(--color-bg-accent-primary)",
                  "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  color: "var(--color-fg-on-accent-primary)",
                }}
              >
                Continuar
              </Button>
            </Box>
          </>
        )}

        {activeStep === 1 && (
          <>
            {/* Documentos Asociados */}
            <DocumentosAsociadosCard
              factura={factura}
              onDownloadPdf={handleDownloadPdf}
              {...(showXmlUi
                ? {
                    onUploadXmlClick: () => setUploadXmlModalOpen(true),
                    onDownloadXml: handleDownloadXml,
                  }
                : {})}
            />

            {/* Conditions Card */}
            <Box
              sx={{
                backgroundColor: "var(--color-bg-default-primary)",
                borderRadius: 3,
                p: 3,
                mt: 3,
                boxShadow: "var(--shadow-popover)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)", mb: 3 }}
              >
                Condiciones de Financiamiento
              </Typography>

              {step2Error && (
                <Alert
                  severity="error"
                  sx={{ mb: 3 }}
                  onClose={() => setStep2Error(null)}
                >
                  {step2Error}
                </Alert>
              )}

              {step2Success && (
                <Alert
                  severity="success"
                  sx={{ mb: 3 }}
                  onClose={() => setStep2Success(null)}
                >
                  {step2Success}
                </Alert>
              )}

              {/* Monto a Financiar */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "var(--color-fg-default-secondary)", mb: 1 }}
                >
                  Monto a Financiar: {truncateToTwo(montoFinanciar)}%
                </Typography>
                <Slider
                  value={montoFinanciar}
                  onChange={(_, value) => setMontoFinanciar(value as number)}
                  min={1}
                  max={100}
                  step={1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${truncateToTwo(value)}%`}
                  sx={{
                    color: "var(--color-fg-accent-primary)",
                    "& .MuiSlider-thumb": {
                      backgroundColor: "var(--color-bg-accent-primary)",
                    },
                    "& .MuiSlider-track": {
                      backgroundColor: "var(--color-bg-accent-primary)",
                    },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ color: "var(--color-fg-default-tertiary)" }}>
                    Monto Total: {formatCurrency(factura.montoTotal)}
                  </Typography>
                  <Chip
                    label={`A Financiar: ${formatCurrency(calculatedMontoFinanciar)}`}
                    sx={{
                      backgroundColor: "var(--color-bg-success-secondary)",
                      color: "var(--color-fg-success-primary)",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>

              {/* Plazo */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "var(--color-fg-default-secondary)", mb: 1 }}
                >
                  Plazo (días)
                </Typography>
                <TextField
                  value={plazo === 0 ? "" : plazo}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Solo permitir dígitos
                    const onlyNums = value.replace(/[^0-9]/g, "");
                    // No permitir que empiece con 0 y limitar a 3 caracteres
                    if (onlyNums.startsWith("0") || onlyNums.length > 3) {
                      return;
                    }
                    setPlazo(onlyNums === "" ? 0 : Number(onlyNums));
                  }}
                  fullWidth
                  size="small"
                  error={plazo > 180}
                  helperText={
                    plazo > 180
                      ? "El plazo máximo es de 180 días"
                      : `Mínimo ${MIN_PLAZO} día, Máximo ${MAX_PLAZO} días`
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: plazo > 180 ? "var(--color-border-danger-secondary)" : "var(--color-border-accent-primary)",
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Visibility Selection Card */}
            <Box
              sx={{
                backgroundColor: "var(--color-bg-default-primary)",
                borderRadius: 3,
                p: 3,
                mt: 3,
                boxShadow: "var(--shadow-popover)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)", mb: 2 }}
              >
                Visibilidad en Marketplace
              </Typography>

              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: "var(--color-fg-default-secondary)", mb: 1 }}>
                  ¿Quién puede ver esta factura?
                </FormLabel>
                <RadioGroup
                  value={visibilidad}
                  onChange={(e) =>
                    setVisibilidad(e.target.value as "TODOS" | "SELECCIONADOS")
                  }
                >
                  <FormControlLabel
                    value="TODOS"
                    control={
                      <Radio
                        sx={{
                          color: "var(--color-fg-default-secondary)",
                          "&.Mui-checked": { color: "var(--color-fg-accent-primary)" },
                        }}
                      />
                    }
                    label="Todos los Factorings"
                  />
                  <FormControlLabel
                    value="SELECCIONADOS"
                    control={
                      <Radio
                        sx={{
                          color: "var(--color-fg-default-secondary)",
                          "&.Mui-checked": { color: "var(--color-fg-accent-primary)" },
                        }}
                      />
                    }
                    label="Solo Factorings seleccionados"
                  />
                </RadioGroup>
              </FormControl>

              {visibilidad === "SELECCIONADOS" && (
                <Box sx={{ maxWidth: 500 }}>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Seleccionar Factorings</InputLabel>
                    <Select
                      multiple
                      value={selectedFactorings}
                      onChange={(e) =>
                        setSelectedFactorings(e.target.value as string[])
                      }
                      label="Seleccionar Factorings"
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => {
                            const factoring = factorings.find(
                              (f) => f.id === value,
                            );
                            return (
                              <Chip
                                key={value}
                                label={factoring?.razonSocial || value}
                                size="small"
                                sx={{
                                  backgroundColor: "var(--color-bg-accent-secondary)",
                                  color: "var(--color-fg-accent-primary)",
                                  fontWeight: 500,
                                }}
                              />
                            );
                          })}
                        </Box>
                      )}
                      disabled={loadingFactorings}
                    >
                      {factorings.map((factoring) => {
                        const isSelected = selectedFactorings.includes(
                          factoring.id!,
                        );
                        return (
                          <MenuItem
                            key={factoring.id}
                            value={factoring.id}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              backgroundColor: isSelected
                                ? "var(--color-bg-accent-secondary)"
                                : "transparent",
                              "&:hover": {
                                backgroundColor: isSelected
                                  ? "var(--color-bg-accent-secondary-hover)"
                                  : undefined,
                              },
                            }}
                          >
                            <span>
                              {factoring.razonSocial} - {factoring.rut}
                            </span>
                            {isSelected && (
                              <Check
                                sx={{ color: "var(--color-fg-accent-primary)", ml: 1, fontSize: 20 }}
                              />
                            )}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>
              )}
            </Box>

            {/* Navigation Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={handlePrevious}
                sx={{
                  borderColor: "var(--color-fg-default-secondary)",
                  color: "var(--color-fg-default-secondary)",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    borderColor: "var(--color-fg-default-primary)",
                    backgroundColor: "var(--color-bg-default-tertiary)",
                  },
                }}
              >
                Anterior
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStep2Valid() || savingStep2}
                sx={{
                  backgroundColor: "var(--color-bg-accent-primary)",
                  "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
                  "&:disabled": {
                    backgroundColor: "var(--color-bg-disabled-primary)",
                  },
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  color: "var(--color-fg-on-accent-primary)",
                }}
              >
                {savingStep2 ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Continuar"
                )}
              </Button>
            </Box>
          </>
        )}

        {activeStep === 2 && (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              {/* Summary Cards */}
              <FacturaResumenCard
                factura={factura}
                showSolicitudFields={showSolicitudFields}
              />

            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
                {showXmlUi && hasFacturaXml(factura) && (
                <Box
                  sx={{
                    backgroundColor: "var(--color-bg-default-primary)",
                    borderRadius: 3,
                    p: 3,
                    mb: 3,
                    boxShadow: "var(--shadow-popover)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CheckCircle sx={{ color: "var(--color-fg-success-primary)", fontSize: 32 }} />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
                      >
                        XML Validado
                      </Typography>
                      <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
                        {factura.facturaNameFile || "factura.xml"} - Documento
                        verificado
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                )}

                {/* PDF Validated Card */}
                <Box
                  sx={{
                    backgroundColor: "var(--color-bg-default-primary)",
                    borderRadius: 3,
                    p: 3,
                    mb: 3,
                    boxShadow: "var(--shadow-popover)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CheckCircle sx={{ color: "var(--color-fg-success-primary)", fontSize: 32 }} />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
                      >
                        PDF Validado
                      </Typography>
                      <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
                        {factura.facturaNameFilePDF || "factura.pdf"} -
                        Documento subido correctamente
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

            {/* Financial Conditions Card */}
            <Box
              sx={{
                backgroundColor: "var(--color-bg-default-primary)",
                borderRadius: 3,
                p: 3,
                mb: 3,
                boxShadow: "var(--shadow-popover)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)", mb: 2 }}
              >
                Condiciones Financieras
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "var(--color-bg-default-tertiary)",
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                    Monto a Financiar
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "var(--color-fg-success-primary)" }}
                  >
                    {formatCurrency(factura.montoFinanciar)} (
                    {truncateToTwo(montoFinanciar)}%)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "var(--color-bg-default-tertiary)",
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                    Plazo
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)" }}
                  >
                    {factura.plazo} días
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Visibility Summary Card */}
            <Box
              sx={{
                backgroundColor: "var(--color-bg-default-primary)",
                borderRadius: 3,
                p: 3,
                mb: 3,
                boxShadow: "var(--shadow-popover)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)", mb: 2 }}
              >
                Visibilidad en Marketplace
              </Typography>

              {step3Error && (
                <Alert
                  severity="error"
                  sx={{ mb: 3 }}
                  onClose={() => setStep3Error(null)}
                >
                  {step3Error}
                </Alert>
              )}

              {visibilidad === "TODOS" ? (
                <Box
                  sx={{
                    backgroundColor: "var(--color-bg-success-secondary)",
                    borderRadius: 2,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Visibility sx={{ color: "var(--color-fg-success-primary)", fontSize: 20 }} />
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--color-fg-success-primary)", fontWeight: 500 }}
                  >
                    Esta factura será visible para todos los factorings
                    registrados en la plataforma.
                  </Typography>
                </Box>
              ) : (
                <FactoringsList
                  factorings={factorings.filter((f) =>
                    selectedFactorings.includes(f.id!),
                  )}
                />
              )}
            </Box>

            {/* Navigation Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={handlePrevious}
                sx={{
                  borderColor: "var(--color-fg-default-secondary)",
                  color: "var(--color-fg-default-secondary)",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    borderColor: "var(--color-fg-default-primary)",
                    backgroundColor: "var(--color-bg-default-tertiary)",
                  },
                }}
              >
                Anterior
              </Button>
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={handleSendToMarketplace}
                disabled={sendingToMarketplace}
                sx={{
                  backgroundColor: "var(--color-bg-accent-primary)",
                  "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  color: "var(--color-fg-on-accent-primary)",
                }}
              >
                {sendingToMarketplace ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Enviar a Cotizar"
                )}
              </Button>
            </Box>
          </>
        )}

        {showXmlUi && (
          <UploadXmlModal
            open={uploadXmlModalOpen}
            onClose={() => setUploadXmlModalOpen(false)}
            onSuccess={handleUploadXmlSuccess}
            facturaId={id || ""}
          />
        )}
      </Box>
    </Layout>
  );
};

export default CotizarFactura;
