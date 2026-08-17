import { isXmlUiEnabled } from "../config/featureFlags";
import type { Factura } from "../types/factura";

type FacturaXmlFields = Pick<Factura, "urlFactura">;
type FacturaPdfFields = Pick<Factura, "facturaNameFilePDF" | "urlFacturaPdf">;

export const hasFacturaXml = (factura?: FacturaXmlFields | null) =>
  Boolean(factura?.urlFactura);

type FacturaPdfDownloadFields = Pick<
  Factura,
  "pdfContentBase64" | "urlFacturaPdf" | "facturaNameFilePDF"
>;

export const hasFacturaPdf = (factura?: FacturaPdfFields | null) =>
  Boolean(factura?.facturaNameFilePDF || factura?.urlFacturaPdf);

export const hasFacturaPdfDownloadable = (
  factura?: Pick<Factura, "pdfContentBase64" | "urlFacturaPdf"> | null,
) => Boolean(factura?.pdfContentBase64 || factura?.urlFacturaPdf);

export const getFacturaPdfFileName = (
  factura?: Pick<Factura, "facturaNameFilePDF"> | null,
) => factura?.facturaNameFilePDF || "factura.pdf";

export const downloadFacturaPdf = (factura: FacturaPdfDownloadFields) => {
  const fileName = getFacturaPdfFileName(factura);

  if (factura.pdfContentBase64) {
    const byteCharacters = atob(factura.pdfContentBase64);
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
    return;
  }

  if (factura.urlFacturaPdf) {
    const a = document.createElement("a");
    a.href = factura.urlFacturaPdf;
    a.download = fileName;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

export const shouldBlockForMissingXml = (factura?: FacturaXmlFields | null) =>
  isXmlUiEnabled() && !hasFacturaXml(factura);

export type XmlDisplayState = "available" | "missing-required" | "missing-optional";

export const getXmlDisplayState = (
  factura?: FacturaXmlFields | null,
): XmlDisplayState => {
  if (hasFacturaXml(factura)) return "available";
  return isXmlUiEnabled() ? "missing-required" : "missing-optional";
};
