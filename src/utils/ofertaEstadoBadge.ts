import type { SvgIconComponent } from "@mui/icons-material";
import {
  AccessTime,
  Cancel,
  CheckCircle,
  WarningAmber,
} from "@mui/icons-material";
import { normalizeOfertaEstado, OFERTA_ESTADOS } from "./ofertaEstados";

export type OfertaEstadoBadge = {
  label: string;
  color: string;
  bg: string;
  icon: SvgIconComponent;
};

const BADGES: Record<string, OfertaEstadoBadge> = {
  [OFERTA_ESTADOS.ACTIVA]: {
    label: "Activa",
    color: "var(--color-fg-accent-primary)",
    bg: "var(--color-bg-accent-secondary)",
    icon: AccessTime,
  },
  [OFERTA_ESTADOS.ACEPTADA]: {
    label: "Aceptada",
    color: "var(--color-fg-success-primary)",
    bg: "var(--color-bg-success-secondary)",
    icon: CheckCircle,
  },
  [OFERTA_ESTADOS.RECHAZADA]: {
    label: "Rechazada",
    color: "var(--color-fg-danger-primary)",
    bg: "var(--color-bg-danger-secondary)",
    icon: Cancel,
  },
  [OFERTA_ESTADOS.EXPIRADA]: {
    label: "Expirada",
    color: "var(--color-fg-warning-primary)",
    bg: "var(--color-bg-warning-secondary)",
    icon: WarningAmber,
  },
  [OFERTA_ESTADOS.INACTIVA]: {
    label: "Inactiva",
    color: "var(--color-fg-accent-primary)",
    bg: "var(--color-bg-accent-secondary)",
    icon: AccessTime,
  },
};

/**
 * Colores y etiqueta del badge de estado de una oferta. `labelPorDefecto`
 * cubre los estados que el backend pueda agregar más adelante.
 */
export const getOfertaEstadoBadge = (
  estado?: string | null,
  labelPorDefecto?: string,
): OfertaEstadoBadge => {
  const normalizado = normalizeOfertaEstado(estado);
  return (
    BADGES[normalizado] ?? {
      label: labelPorDefecto ?? estado ?? "",
      color: "var(--color-fg-accent-primary)",
      bg: "var(--color-bg-accent-secondary)",
      icon: AccessTime,
    }
  );
};
