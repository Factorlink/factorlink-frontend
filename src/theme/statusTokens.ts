import type { ReactNode } from "react";
import Description from "@mui/icons-material/Description";
import Storefront from "@mui/icons-material/Storefront";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { createElement } from "react";

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: ReactNode;
}

export function getFacturaStatusConfig(estado: string): StatusConfig {
  switch (estado) {
    case "CARGADA":
      return {
        label: "CARGADA",
        color: "var(--color-fg-default-secondary)",
        bgColor: "var(--color-bg-neutral-secondary)",
        icon: createElement(Description, { sx: { fontSize: 14 } }),
      };
    case "EN_MARKETPLACE":
      return {
        label: "EN MARKETPLACE",
        color: "var(--color-fg-accent-primary)",
        bgColor: "var(--color-bg-accent-secondary)",
        icon: createElement(Storefront, { sx: { fontSize: 14 } }),
      };
    case "CEDIDA":
    case "CON_OFERTAS":
    case "ACEPTADA":
    case "CONFIRMADA":
    case "LIQUIDADA":
      return {
        label: estado.replace(/_/g, " "),
        color: "var(--color-fg-success-primary)",
        bgColor: "var(--color-bg-success-secondary)",
        icon: createElement(CheckCircle, { sx: { fontSize: 14 } }),
      };
    default:
      return {
        label: estado || "N/A",
        color: "var(--color-fg-default-secondary)",
        bgColor: "var(--color-bg-neutral-secondary)",
        icon: createElement(Description, { sx: { fontSize: 14 } }),
      };
  }
}

/** Common surface / text token shortcuts for sx props */
export const surface = {
  card: {
    backgroundColor: "var(--color-bg-default-primary)",
    borderRadius: "var(--radius-l)",
    boxShadow: "var(--shadow-card)",
    border: "1px solid var(--color-border-default-primary)",
  },
  muted: "var(--color-fg-default-secondary)",
  primary: "var(--color-fg-default-primary)",
  accent: "var(--color-fg-accent-primary)",
  success: "var(--color-fg-success-primary)",
  danger: "var(--color-fg-danger-primary)",
  tertiaryBg: "var(--color-bg-default-tertiary)",
  hoverBg: "var(--color-bg-default-primary-hover)",
  border: "var(--color-border-default-primary)",
} as const;
