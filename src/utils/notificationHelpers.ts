import type { SvgIconComponent } from "@mui/icons-material";
import {
  CheckCircleOutline,
  Description,
  LocalOffer,
  MailOutline,
  Notifications,
  Sync,
} from "@mui/icons-material";
import type { Role } from "../types/role";
import type { Notificacion, NotificationTipo } from "../types/notificacion";

const TIPO_LABELS: Record<NotificationTipo, string> = {
  INVITACION_EMPRESA_RECIBIDA: "Invitación a Empresa",
  INVITACION_EMPRESA_RESPONDIDA: "Invitación respondida",
  INVITACION_FACTORING_RECIBIDA: "Invitación a Factoring",
  INVITACION_FACTORING_RESPONDIDA: "Invitación respondida",
  OFERTA_RECIBIDA: "Oferta recibida",
  OFERTA_ACEPTADA: "Oferta aceptada",
  OFERTA_RECHAZADA: "Oferta rechazada",
  OFERTA_EXPIRADA: "Oferta expirada",
  FACTURAS_SINCRONIZADAS: "Facturas sincronizadas",
  DOCUMENTO_LEGAL_PENDIENTE: "Documento pendiente",
  DOCUMENTO_LEGAL_APROBADO: "Documento aprobado",
  DOCUMENTO_LEGAL_RECHAZADO: "Documento rechazado",
};

const INVITACION_TIPOS: NotificationTipo[] = [
  "INVITACION_EMPRESA_RECIBIDA",
  "INVITACION_EMPRESA_RESPONDIDA",
  "INVITACION_FACTORING_RECIBIDA",
  "INVITACION_FACTORING_RESPONDIDA",
];

const OFERTA_TIPOS: NotificationTipo[] = [
  "OFERTA_RECIBIDA",
  "OFERTA_ACEPTADA",
  "OFERTA_RECHAZADA",
  "OFERTA_EXPIRADA",
];

const DOCUMENTO_LEGAL_TIPOS: NotificationTipo[] = [
  "DOCUMENTO_LEGAL_PENDIENTE",
  "DOCUMENTO_LEGAL_APROBADO",
  "DOCUMENTO_LEGAL_RECHAZADO",
];

export const getNotificationTipoLabel = (tipo: NotificationTipo): string =>
  TIPO_LABELS[tipo] ?? tipo;

export const getNotificationIcon = (
  tipo: NotificationTipo,
): SvgIconComponent => {
  if (INVITACION_TIPOS.includes(tipo)) return MailOutline;
  if (OFERTA_TIPOS.includes(tipo)) return LocalOffer;
  if (tipo === "FACTURAS_SINCRONIZADAS") return Sync;
  if (DOCUMENTO_LEGAL_TIPOS.includes(tipo)) {
    if (tipo === "DOCUMENTO_LEGAL_APROBADO") return CheckCircleOutline;
    return Description;
  }
  return Notifications;
};

export const formatNotificationDate = (date: string): string => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isOfertaNotification = (tipo: NotificationTipo): boolean =>
  OFERTA_TIPOS.includes(tipo);

export const getNotificationRoute = (
  notification: Notificacion,
  currentRole: Role | null,
  facturaId?: string | null,
): string | null => {
  const { tipo } = notification;

  if (INVITACION_TIPOS.includes(tipo)) return "/invitations";

  if (isOfertaNotification(tipo)) {
    if (!facturaId) {
      return currentRole?.contexto === "factoring"
        ? "/marketplace"
        : "/facturas/ofertas";
    }

    if (currentRole?.contexto === "factoring") {
      return `/facturas/${facturaId}/factoring?tab=oferta`;
    }

    const params = new URLSearchParams({ ofertas: "true" });
    if (tipo !== "OFERTA_EXPIRADA" && notification.entidadId) {
      params.set("ofertaId", notification.entidadId);
    }
    return `/facturas/${facturaId}?${params.toString()}`;
  }

  if (tipo === "FACTURAS_SINCRONIZADAS") return "/facturas";

  if (DOCUMENTO_LEGAL_TIPOS.includes(tipo)) return "/edit/documentos-legales";

  return null;
};

export const sortUnreadNotifications = (
  notifications: Notificacion[],
): Notificacion[] =>
  [...notifications].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

export const sortReadNotifications = (
  notifications: Notificacion[],
): Notificacion[] =>
  [...notifications].sort((a, b) => {
    const aTime = a.readAt ? new Date(a.readAt).getTime() : 0;
    const bTime = b.readAt ? new Date(b.readAt).getTime() : 0;
    return bTime - aTime;
  });
