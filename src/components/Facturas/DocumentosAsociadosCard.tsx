import { useState } from "react";
import { Box, Typography, Button, CircularProgress, Alert, Divider } from "@mui/material";
import { Description, PictureAsPdf, Cancel, Upload, CloudDownload } from "@mui/icons-material";
import { useFacturas } from "../../hooks/useFacturas";
import type { Factura } from "../../types/factura";
import useAuthStore from "../../store/authStore";
import SiiPersonalSyncPromptModal from "../Modals/SiiPersonalSyncPromptModal";
import { isXmlUiEnabled } from "../../config/featureFlags";
import { hasFacturaPdf, hasFacturaXml } from "../../utils/facturaDocuments";

interface DocumentosAsociadosCardProps {
  factura: Factura;
  onUploadPdfClick: () => void;
  onFetchSiiSuccess: (data: Factura) => void;
  onUploadXmlClick?: () => void;
  onDownloadXml?: (base64: string, fileName: string) => void;
  onDownloadPdf?: (base64: string, fileName: string) => void;
}

type FetchFeedback = {
  severity: "success" | "warning" | "error";
  message: string;
} | null;

const getFetchFeedback = (data: Factura): FetchFeedback => {
  const gotXml = hasFacturaXml(data);
  const gotPdf = hasFacturaPdf(data);

  if (!isXmlUiEnabled()) {
    if (gotPdf) {
      return {
        severity: "success",
        message: "PDF obtenido exitosamente desde el SII.",
      };
    }
    return {
      severity: "warning",
      message: "No se encontró PDF en el SII.",
    };
  }

  if (gotXml && gotPdf) {
    return {
      severity: "success",
      message: "Documentos obtenidos exitosamente desde el SII.",
    };
  }
  if (gotPdf && !gotXml) {
    return {
      severity: "warning",
      message: "PDF obtenido. XML no disponible en el SII.",
    };
  }
  if (gotXml && !gotPdf) {
    return {
      severity: "warning",
      message: "XML obtenido. PDF no disponible en el SII.",
    };
  }
  return {
    severity: "warning",
    message: "No se encontraron documentos en el SII.",
  };
};

const DocumentosAsociadosCard = ({
  factura,
  onUploadXmlClick,
  onUploadPdfClick,
  onDownloadXml,
  onDownloadPdf,
  onFetchSiiSuccess,
}: DocumentosAsociadosCardProps) => {
  const { fetchXMLContent } = useFacturas();
  const [fetching, setFetching] = useState(false);
  const [fetchFeedback, setFetchFeedback] = useState<FetchFeedback>(null);
  const [promptModalOpen, setPromptModalOpen] = useState(false);

  const { currentRole } = useAuthStore();
  const empresa = currentRole?.empresa;
  const isPersonalLinked = empresa?.siiRutPersonal != null;
  const showXmlUi = isXmlUiEnabled();

  const isCargada = factura.estado?.toLowerCase() === "cargada";
  const hasPdf = hasFacturaPdf(factura);

  const handleDownloadXml = () => {
    if (onDownloadXml && factura.xmlContentBase64) {
      onDownloadXml(factura.xmlContentBase64, factura.facturaNameFile || "factura.xml");
    }
  };

  const handleDownloadPdf = () => {
    if (onDownloadPdf && factura.pdfContentBase64) {
      onDownloadPdf(factura.pdfContentBase64, factura.facturaNameFilePDF || "factura.pdf");
    }
  };

  const handleFetchSii = async () => {
    try {
      setFetching(true);
      setFetchFeedback(null);
      const data = await fetchXMLContent(factura.id);
      onFetchSiiSuccess(data);
      setFetchFeedback(getFetchFeedback(data));
    } catch (err) {
      console.error("Error fetching SII documents:", err);
      setFetchFeedback({
        severity: "error",
        message: showXmlUi
          ? "No se pudieron obtener los documentos del SII. Intente nuevamente."
          : "No se pudo obtener el PDF desde el SII. Intente nuevamente.",
      });
    } finally {
      setFetching(false);
    }
  };

  const fetchButtonLabel = showXmlUi
    ? fetching
      ? "Obteniendo documentos..."
      : "Obtener XML y PDF desde el SII"
    : fetching
      ? "Obteniendo PDF..."
      : "Obtener PDF desde el SII";

  return (
    <Box
      sx={{
        backgroundColor: "var(--color-bg-default-primary)",
        borderRadius: 3,
        p: 3,
        boxShadow: "var(--shadow-popover)",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Box
          sx={{
            backgroundColor: "var(--color-bg-default-tertiary)",
            borderRadius: 2,
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Description sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}>
            Documentos Asociados
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--color-fg-default-secondary)" }}>
            {showXmlUi
              ? "XML, PDF y obtención automática desde el SII"
              : "PDF y obtención automática desde el SII"}
          </Typography>
        </Box>
      </Box>

      {showXmlUi && (
        <>
          {/* Fila 1: XML */}
          <Box
            sx={{
              backgroundColor: "var(--color-bg-default-tertiary)",
              borderRadius: 2,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            {factura.urlFactura ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Description sx={{ color: "var(--color-fg-success-primary)" }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}>
                    <Typography
                      role="button"
                      sx={{ color: "var(--color-fg-success-primary)", cursor: "pointer" }}
                      onClick={handleDownloadXml}
                    >
                      {factura.facturaNameFile || "Archivo XML"}
                    </Typography>
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                    Documento cargado
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Cancel sx={{ color: "var(--color-fg-danger-primary)" }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}>
                    XML No Cargado
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                    Adjunta el archivo XML del SII
                  </Typography>
                </Box>
              </Box>
            )}
            {isCargada && onUploadXmlClick && (
              <Button
                variant="contained"
                startIcon={<Upload />}
                onClick={onUploadXmlClick}
                sx={{
                  backgroundColor: "var(--color-bg-accent-primary)",
                  color: "var(--color-fg-on-accent-primary)",
                  "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {factura.urlFactura ? "Reemplazar" : "Adjuntar"} XML
              </Button>
            )}
          </Box>
          <Box sx={{ pl: 2, mb: 2 }}>
            <Typography
              variant="caption"
              sx={{ color: factura.urlFactura ? "var(--color-fg-success-primary)" : "var(--color-fg-warning-primary)" }}
            >
              {factura.urlFactura
                ? "XML validado correctamente - Folio, RUT y monto coinciden"
                : "Pendiente de subir XML para validación"}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />
        </>
      )}

      {/* Fila PDF */}
      <Box
        sx={{
          backgroundColor: "var(--color-bg-default-tertiary)",
          borderRadius: 2,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        {hasPdf ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <PictureAsPdf sx={{ color: "var(--color-fg-success-primary)" }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}>
                <Typography
                  role="button"
                  sx={{ color: "var(--color-fg-success-primary)", cursor: "pointer" }}
                  onClick={handleDownloadPdf}
                >
                  {factura.facturaNameFilePDF || "Archivo PDF"}
                </Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                Documento cargado
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Cancel sx={{ color: "var(--color-fg-danger-primary)" }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}>
                PDF No Cargado
              </Typography>
              <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
                Adjunta el archivo PDF de la factura
              </Typography>
            </Box>
          </Box>
        )}
        {isCargada && (
          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={onUploadPdfClick}
            sx={{
              backgroundColor: "var(--color-bg-accent-primary)",
              color: "var(--color-fg-on-accent-primary)",
              "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {hasPdf ? "Reemplazar" : "Adjuntar"} PDF
          </Button>
        )}
      </Box>
      <Box sx={{ pl: 2, mb: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: hasPdf ? "var(--color-fg-success-primary)" : "var(--color-fg-warning-primary)" }}
        >
          {hasPdf ? "PDF cargado correctamente" : "Pendiente de subir PDF"}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Obtener documentos del SII */}
      {fetchFeedback && (
        <Alert
          severity={fetchFeedback.severity}
          sx={{ mb: 2 }}
          onClose={() => setFetchFeedback(null)}
        >
          {fetchFeedback.message}
        </Alert>
      )}

      <Button
        variant="contained"
        fullWidth
        startIcon={fetching ? <CircularProgress size={20} sx={{ color: "var(--color-fg-on-accent-primary)" }} /> : <CloudDownload />}
        onClick={isPersonalLinked ? handleFetchSii : () => setPromptModalOpen(true)}
        disabled={fetching}
        sx={{
          backgroundColor: "var(--color-bg-accent-primary)",
          "&:hover": { backgroundColor: "var(--color-bg-accent-primary-hover)" },
          "&:disabled": { opacity: 0.7 },
          textTransform: "none",
          fontWeight: 600,
          py: 1.5,
          color: "var(--color-fg-on-accent-primary)",
        }}
      >
        {fetchButtonLabel}
      </Button>
      <Box sx={{ pl: 2, pt: 1 }}>
        <Typography variant="caption" sx={{ color: "var(--color-fg-default-secondary)" }}>
          {showXmlUi
            ? "Obten automáticamente ambos documentos asociados a esta factura desde el SII"
            : "Obten automáticamente el PDF asociado a esta factura desde el SII"}
        </Typography>
      </Box>

      <SiiPersonalSyncPromptModal
        open={promptModalOpen}
        onClose={() => setPromptModalOpen(false)}
      />
    </Box>
  );
};

export default DocumentosAsociadosCard;
