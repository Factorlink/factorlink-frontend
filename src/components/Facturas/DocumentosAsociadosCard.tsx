import { Box, Typography, Button, Divider } from "@mui/material";
import { Description, PictureAsPdf, Cancel, Upload } from "@mui/icons-material";
import type { Factura, FacturaArchivo } from "../../types/factura";
import { isXmlUiEnabled } from "../../config/featureFlags";
import { downloadFacturaPdf, hasFacturaPdf } from "../../utils/facturaDocuments";
import AdjuntarDocumentosAdicionalesCard, {
  type FacturaAdjuntoUploadPayload,
} from "./AdjuntarDocumentosAdicionalesCard";

interface DocumentosAsociadosCardProps {
  factura: Factura;
  onUploadXmlClick?: () => void;
  onDownloadXml?: (base64: string, fileName: string) => void;
  onDownloadPdf?: (base64: string, fileName: string) => void;
  adjuntos?: FacturaArchivo[];
  onAdjuntosChange?: (files: FacturaArchivo[]) => void;
  onUploadAdjunto?: (
    payload: FacturaAdjuntoUploadPayload,
  ) => Promise<FacturaArchivo>;
  onDeleteAdjunto?: (archivoId: string) => Promise<void>;
}

const DocumentosAsociadosCard = ({
  factura,
  onUploadXmlClick,
  onDownloadXml,
  onDownloadPdf,
  adjuntos,
  onAdjuntosChange,
  onUploadAdjunto,
  onDeleteAdjunto,
}: DocumentosAsociadosCardProps) => {
  const showXmlUi = isXmlUiEnabled();
  const isCargada = factura.estado?.toLowerCase() === "cargada";
  const adjuntosList = adjuntos ?? [];
  const hasAdjuntosHandlers = Boolean(
    onUploadAdjunto && onDeleteAdjunto && onAdjuntosChange,
  );
  const canManageAdjuntos =
    hasAdjuntosHandlers &&
    ["EN_MARKETPLACE", "CON_OFERTAS"].includes(factura.estado);
  const showAdjuntos = canManageAdjuntos || adjuntosList.length > 0;

  if (!hasFacturaPdf(factura)) {
    return null;
  }

  const handleDownloadXml = () => {
    if (onDownloadXml && factura.xmlContentBase64) {
      onDownloadXml(factura.xmlContentBase64, factura.facturaNameFile || "factura.xml");
    }
  };

  const handleDownloadPdf = () => {
    if (onDownloadPdf && factura.pdfContentBase64) {
      onDownloadPdf(
        factura.pdfContentBase64,
        factura.facturaNameFilePDF || "factura.pdf",
      );
      return;
    }
    downloadFacturaPdf(factura);
  };

  const subtitle = showAdjuntos
    ? showXmlUi
      ? "XML, PDF y documentos adicionales"
      : "PDF y documentos adicionales"
    : showXmlUi
      ? "XML y PDF de la factura"
      : "PDF de la factura";

  return (
    <Box
      sx={{
        backgroundColor: "var(--color-bg-default-primary)",
        borderRadius: 3,
        p: 3,
        boxShadow: "var(--shadow-popover)",
      }}
    >
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
            {subtitle}
          </Typography>
        </Box>
      </Box>

      {showXmlUi && (
        <>
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
      </Box>
      <Box sx={{ pl: 2 }}>
        <Typography variant="caption" sx={{ color: "var(--color-fg-success-primary)" }}>
          PDF cargado correctamente
        </Typography>
      </Box>

      {showAdjuntos && (
        <>
          <Divider sx={{ my: 2 }} />
          <AdjuntarDocumentosAdicionalesCard
            variant="embedded"
            readOnly={!canManageAdjuntos}
            facturaId={factura.id}
            files={adjuntosList}
            onChange={onAdjuntosChange}
            onUpload={onUploadAdjunto}
            onDelete={onDeleteAdjunto}
          />
        </>
      )}
    </Box>
  );
};

export default DocumentosAsociadosCard;
