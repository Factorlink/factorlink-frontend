import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
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
  Send,
  Check,
  RequestQuote,
  Visibility,
} from "@mui/icons-material";
import Layout from "../../../components/Layout";
import type { Factura } from "../../../types/factura";
import type { Factoring } from "../../../types/factoring";
import { useFacturas } from "../../../hooks/useFacturas";
import { useFactoring } from "../../../hooks/useFactoring";
import UploadXmlModal from "../../../components/Modals/UploadXmlModal";
import ObtenerFacturaSiiModal from "../../../components/Modals/ObtenerFacturaSiiModal";
import FacturaEnviadaCotizarModal from "../../../components/Modals/FacturaEnviadaCotizarModal";
import FacturaResumenCard, {
  formatCurrency,
} from "../../../components/Facturas/FacturaResumenCard";
import DocumentosAsociadosCard from "../../../components/Facturas/DocumentosAsociadosCard";
import AdjuntarDocumentosAdicionalesCard, {
  type FacturaAdjuntoPendiente,
} from "../../../components/Facturas/AdjuntarDocumentosAdicionalesCard";
import SectionPanel from "../../../components/SectionPanel";
import { appContentSx } from "../../../theme/layoutStyles";
import { isXmlUiEnabled } from "../../../config/featureFlags";
import {
  hasFacturaPdf,
  shouldBlockForMissingXml,
} from "../../../utils/facturaDocuments";

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
    uploadFacturaArchivo,
    refreshFactura,
    fetchXMLContent,
  } = useFacturas();
  const { getAllFactorings, loading: loadingFactorings } = useFactoring();
  const { id } = useParams();
  const navigate = useNavigate();

  const [factura, setFactura] = useState<Factura | null>(null);
  const [factorings, setFactorings] = useState<Factoring[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadXmlModalOpen, setUploadXmlModalOpen] = useState(false);

  const [montoFinanciar, setMontoFinanciar] = useState<number>(100);
  const [plazo, setPlazo] = useState<number>(1);
  const [visibilidad, setVisibilidad] = useState<"TODOS" | "SELECCIONADOS">(
    "TODOS",
  );
  const [selectedFactorings, setSelectedFactorings] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [adjuntos, setAdjuntos] = useState<FacturaAdjuntoPendiente[]>([]);
  const [pdfGate, setPdfGate] = useState<"loading" | "error" | "ready">("loading");
  const [successOpen, setSuccessOpen] = useState(false);

  const applyFacturaData = (data: Factura) => {
    setFactura(data);
    if (data.montoTotal) {
      const percentage = data.montoFinanciar
        ? (parseFloat(data.montoFinanciar) / parseFloat(data.montoTotal)) * 100
        : 100;
      setMontoFinanciar(truncateToTwo(percentage));
    }
    if (data.plazo) {
      setPlazo(data.plazo);
    }
  };

  const obtainPdfFromSii = useCallback(async () => {
    if (!id) return;
    setPdfGate("loading");
    try {
      const fetched = await fetchXMLContent(id);
      if (!hasFacturaPdf(fetched)) {
        setPdfGate("error");
        return;
      }
      applyFacturaData(fetched);
      setPdfGate("ready");
    } catch (err) {
      console.error("Error fetching PDF from SII:", err);
      setPdfGate("error");
    }
  }, [id]);

  const fetchFactorings = async () => {
    try {
      const data = await getAllFactorings();
      setFactorings(data || []);
    } catch (err) {
      console.error("Error fetching factorings:", err);
    }
  };

  const prepareCotizar = useCallback(async () => {
    if (!id) return;
    setPdfGate("loading");
    setError(null);
    try {
      const data = await getFacturaById(id);
      if (hasFacturaPdf(data)) {
        applyFacturaData(data);
        setPdfGate("ready");
        return;
      }
      applyFacturaData(data);
      await obtainPdfFromSii();
    } catch (err) {
      console.error("Error fetching factura:", err);
      setError("No se pudo cargar la factura. Por favor, intente nuevamente.");
    }
  }, [id, obtainPdfFromSii]);

  useEffect(() => {
    if (id) {
      void prepareCotizar();
      void fetchFactorings();
    }
  }, [id, prepareCotizar]);

  const handleBack = () => {
    navigate(-1);
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

  const getValidationError = () => {
    const xmlValidation = validateXmlMatch();
    if (!xmlValidation.valid) return xmlValidation.message;

    const pdfValidation = validatePdfUploaded();
    if (!pdfValidation.valid) return pdfValidation.message;

    const montoValidation = validateMontoFinanciar();
    if (!montoValidation.valid) return montoValidation.message;

    const plazoValidation = validatePlazo();
    if (!plazoValidation.valid) return plazoValidation.message;

    if (visibilidad === "SELECCIONADOS" && selectedFactorings.length === 0) {
      return "Debe seleccionar al menos un Factoring";
    }

    return null;
  };

  const handleEnviarACotizar = async () => {
    if (!factura) return;

    const validationError = getValidationError();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      for (const adjunto of adjuntos) {
        await uploadFacturaArchivo(id!, {
          nombreArchivo: adjunto.nombreArchivo,
          archivoBase64: adjunto.archivoBase64,
          mimeType: adjunto.mimeType,
        });
      }

      const calculatedMontoFinanciar = Math.trunc(
        (parseFloat(factura.montoTotal) * montoFinanciar) / 100,
      );

      await updateFactura(id!, {
        plazo,
        montoFinanciar: calculatedMontoFinanciar,
      });

      await sendToMarketplace(id!, {
        visibilidad,
        factoringIds: visibilidad === "TODOS" ? [] : selectedFactorings,
      });

      setSuccessOpen(true);
    } catch (err) {
      console.error("Error sending factura to marketplace:", err);
      setSubmitError(
        adjuntos.length > 0
          ? "Error al subir documentos o enviar a cotizar. Intente nuevamente."
          : "Error al enviar a cotizar. Intente nuevamente.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelPdfGate = () => {
    navigate(`/facturas/${id}`);
  };

  const handleGoToFacturas = () => {
    navigate("/facturas");
  };

  const calculatedMontoFinanciar = factura
    ? Math.round((parseFloat(factura.montoTotal) * montoFinanciar) / 100)
    : 0;

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

  if (pdfGate === "ready" && !factura) {
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

  const showXmlUi = isXmlUiEnabled();
  const showForm = pdfGate === "ready" && Boolean(factura);

  return (
    <Layout>
      <Box sx={appContentSx}>
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

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "var(--color-fg-default-primary)", mb: 0.5 }}
          >
            Cotizar Factura
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
            Completa la información para enviar esta factura a cotizar.
          </Typography>
        </Box>

        {showForm && factura && (
          <>
        <FacturaResumenCard factura={factura} showSolicitudFields={false} />

        <Box sx={{ mb: 3 }}>
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
        </Box>

        <AdjuntarDocumentosAdicionalesCard
          files={adjuntos}
          onChange={setAdjuntos}
          disabled={submitting}
        />

        <SectionPanel
          title="Condiciones de financiamiento"
          subtitle="Define el monto y el plazo de la solicitud"
          icon={<RequestQuote sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }} />}
        >
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
                const onlyNums = value.replace(/[^0-9]/g, "");
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
        </SectionPanel>

        <SectionPanel
          title="Visibilidad en Marketplace"
          subtitle="¿Quién puede ver esta factura?"
          icon={<Visibility sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }} />}
        >
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
        </SectionPanel>

        {submitError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setSubmitError(null)}
          >
            {submitError}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
            mb: 3,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleBack}
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
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleEnviarACotizar}
            disabled={Boolean(getValidationError()) || submitting}
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
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Enviar a cotizar"
            )}
          </Button>
        </Box>
          </>
        )}

        <ObtenerFacturaSiiModal
          open={pdfGate === "loading" || pdfGate === "error"}
          status={pdfGate === "error" ? "error" : "loading"}
          onRetry={obtainPdfFromSii}
          onCancel={handleCancelPdfGate}
        />

        <FacturaEnviadaCotizarModal
          open={successOpen}
          folio={factura?.folio ?? ""}
          montoTotal={factura?.montoTotal ?? "0"}
          visibilidad={visibilidad}
          onGoToFacturas={handleGoToFacturas}
        />

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
