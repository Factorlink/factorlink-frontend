import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import type { Factura, FacturaArchivo } from "../../types/factura";
import { useFacturas } from "../../hooks/useFacturas";
import UploadXmlModal from "../Modals/UploadXmlModal";
import FactoringsList from "./FactoringsList";
import FacturaResumenCard from "./FacturaResumenCard";
import DetalleCotizacionCard from "./DetalleCotizacionCard";
import DocumentosAsociadosCard from "./DocumentosAsociadosCard";
import { isXmlUiEnabled } from "../../config/featureFlags";

const downloadBase64File = (
  base64: string,
  fileName: string,
  mimeType: string,
) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export type FacturaDetalleInformacionProps = {
  factura: Factura;
  onFacturaChange: (factura: Factura) => void;
  dense?: boolean;
  includeDocumentos?: boolean;
};

const FacturaDetalleInformacion = ({
  factura,
  onFacturaChange,
  dense = false,
  includeDocumentos = true,
}: FacturaDetalleInformacionProps) => {
  const isCargada = factura.estado?.toLowerCase() === "cargada";
  const isInMarketplace = ["EN_MARKETPLACE", "CON_OFERTAS"].includes(
    factura.estado,
  );
  const cardPadding = dense ? 2 : 3;
  const cardMb = dense ? 2 : 3;

  return (
    <>
      <FacturaResumenCard
        factura={factura}
        showSolicitudFields={!isCargada}
      />

      {!isCargada && (
        <DetalleCotizacionCard
          plazo={factura.plazo}
          porcentajeFinanciamiento={factura.porcentajeFinanciamiento || "0"}
          montoFinanciar={factura.montoFinanciar}
        />
      )}

      {isInMarketplace && (
        <Box
          sx={{
            backgroundColor: "var(--color-bg-default-primary)",
            borderRadius: 3,
            p: cardPadding,
            mb: cardMb,
            boxShadow: "var(--shadow-popover)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
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
              <Visibility
                sx={{ color: "var(--color-fg-accent-primary)", fontSize: 24 }}
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-fg-default-primary)",
                }}
              >
                Visibilidad en Marketplace
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--color-fg-default-secondary)" }}
              >
                Factorings que pueden ver esta factura
              </Typography>
            </Box>
          </Box>

          {factura.visibilidad === "TODOS" ? (
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
              <Visibility
                sx={{ color: "var(--color-fg-success-primary)", fontSize: 20 }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "var(--color-fg-success-primary)",
                  fontWeight: 500,
                }}
              >
                Esta factura es visible para todos los factorings registrados en
                la plataforma.
              </Typography>
            </Box>
          ) : (
            <FactoringsList
              factorings={factura.visibilidadDetalle?.factorings || []}
            />
          )}
        </Box>
      )}

      {includeDocumentos && (
        <FacturaDetalleDocumentos
          factura={factura}
          onFacturaChange={onFacturaChange}
        />
      )}
    </>
  );
};

/** Documentos + XML modal, for page layout beside Acciones. */
export const FacturaDetalleDocumentos = ({
  factura,
  onFacturaChange,
}: {
  factura: Factura;
  onFacturaChange: (factura: Factura) => void;
}) => {
  const { refreshFactura, uploadFacturaArchivo, deleteFacturaArchivo } =
    useFacturas();
  const [uploadXmlModalOpen, setUploadXmlModalOpen] = useState(false);
  const showXmlUi = isXmlUiEnabled();

  const handleUploadXmlSuccess = async () => {
    try {
      const data = await refreshFactura(factura.id);
      onFacturaChange(data);
    } catch (err) {
      console.error("Error refreshing factura:", err);
    }
  };

  return (
    <>
      <DocumentosAsociadosCard
        factura={factura}
        adjuntos={factura.archivos ?? []}
        onAdjuntosChange={(files) =>
          onFacturaChange({ ...factura, archivos: files })
        }
        onUploadAdjunto={async (payload) => {
          const uploaded = await uploadFacturaArchivo(factura.id, payload);
          if (uploaded?.id) return uploaded;
          const refreshed = await refreshFactura(factura.id);
          const match = (refreshed.archivos ?? []).find(
            (archivo: FacturaArchivo) =>
              archivo.nombreArchivo === payload.nombreArchivo,
          );
          if (!match) {
            throw new Error("No se pudo confirmar el archivo subido");
          }
          return match;
        }}
        onDeleteAdjunto={(archivoId) =>
          deleteFacturaArchivo(factura.id, archivoId)
        }
        onDownloadPdf={(base64, fileName) =>
          downloadBase64File(base64, fileName, "application/pdf")
        }
        {...(showXmlUi
          ? {
              onUploadXmlClick: () => setUploadXmlModalOpen(true),
              onDownloadXml: (base64: string, fileName: string) =>
                downloadBase64File(base64, fileName, "application/xml"),
            }
          : {})}
      />
      {showXmlUi && (
        <UploadXmlModal
          open={uploadXmlModalOpen}
          onClose={() => setUploadXmlModalOpen(false)}
          onSuccess={handleUploadXmlSuccess}
          facturaId={factura.id}
        />
      )}
    </>
  );
};

export default FacturaDetalleInformacion;
