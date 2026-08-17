import { isXmlUiEnabled } from "../config/featureFlags";
import type { Factura } from "../types/factura";

type FacturaXmlFields = Pick<Factura, "urlFactura">;
type FacturaPdfFields = Pick<Factura, "facturaNameFilePDF" | "urlFacturaPdf">;

export const hasFacturaXml = (factura?: FacturaXmlFields | null) =>
  Boolean(factura?.urlFactura);

export const hasFacturaPdf = (factura?: FacturaPdfFields | null) =>
  Boolean(factura?.facturaNameFilePDF || factura?.urlFacturaPdf);

export const shouldBlockForMissingXml = (factura?: FacturaXmlFields | null) =>
  isXmlUiEnabled() && !hasFacturaXml(factura);

export type XmlDisplayState = "available" | "missing-required" | "missing-optional";

export const getXmlDisplayState = (
  factura?: FacturaXmlFields | null,
): XmlDisplayState => {
  if (hasFacturaXml(factura)) return "available";
  return isXmlUiEnabled() ? "missing-required" : "missing-optional";
};
