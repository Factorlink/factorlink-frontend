export const featureFlags = {
  requireFacturaXml: import.meta.env.VITE_REQUIRE_FACTURA_XML !== "false",
};

export const isXmlUiEnabled = () => featureFlags.requireFacturaXml;
