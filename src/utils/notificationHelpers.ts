import type { SvgIconComponent } from "@mui/icons-material";
import {
  ChatBubbleOutline,
  CheckCircleOutline,
  Description,
  LocalOffer,
  MailOutline,
  Notifications,
  Sync,
} from "@mui/icons-material";
import type { Role } from "../types/role";
import {
  FACTURA_GRUPO_ENTIDAD,
  type Notificacion,
  type NotificacionContext,
  type NotificationTipo,
} from "../types/notificacion";
import {
  getFacturaGrupoEmpresaPath,
  getFacturaGrupoFactoringPath,
} from "./facturaGrupo";

export const getNotificacionContextFromRole = (
  role: Role | null,
): NotificacionContext | null => {
  if (role?.contexto === "empresa" && role.empresaId) {
    return { empresaId: role.empresaId };
  }
  if (role?.contexto === "factoring" && role.factoringId) {
    return { factoringId: role.factoringId };
  }
  return null;
};

const TIPO_LABELS: Record<NotificationTipo, string> = {
  INVITACION_EMPRESA_RECIBIDA: "Invitación a Empresa",
  INVITACION_EMPRESA_RESPONDIDA: "Invitación respondida",
  INVITACION_FACTORING_RECIBIDA: "Invitación a Factoring",
  INVITACION_FACTORING_RESPONDIDA: "Invitación respondida",
  OFERTA_RECIBIDA: "Oferta recibida",
  OFERTA_NUEVO_COMENTARIO: "Nuevo comentario",
  OFERTA_RESPONDIDA: "Oferta respondida",
  OFERTA_ACTUALIZADA: "Oferta actualizada",
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

/** Notificaciones de la conversación de una oferta condicionada. */
const OFERTA_CONVERSACION_TIPOS: NotificationTipo[] = [
  "OFERTA_NUEVO_COMENTARIO",
  "OFERTA_RESPONDIDA",
];

const OFERTA_TIPOS: NotificationTipo[] = [
  "OFERTA_RECIBIDA",
  ...OFERTA_CONVERSACION_TIPOS,
  "OFERTA_ACTUALIZADA",
  "OFERTA_ACEPTADA",
  "OFERTA_RECHAZADA",
  "OFERTA_EXPIRADA",
];

const DOCUMENTO_LEGAL_TIPOS: NotificationTipo[] = [
  "DOCUMENTO_LEGAL_PENDIENTE",
  "DOCUMENTO_LEGAL_APROBADO",
  "DOCUMENTO_LEGAL_RECHAZADO",
];

export type NotificationRouteContext = {
  facturaId?: string | null;
  facturaGrupoId?: string | null;
  /** Id de la oferta (normalmente notification.entidadId cuando entidad=oferta). */
  ofertaId?: string | null;
};

export const getNotificationTipoLabel = (tipo: NotificationTipo): string =>
  TIPO_LABELS[tipo] ?? tipo;

export const getNotificationIcon = (
  tipo: NotificationTipo,
): SvgIconComponent => {
  if (INVITACION_TIPOS.includes(tipo)) return MailOutline;
  if (OFERTA_CONVERSACION_TIPOS.includes(tipo)) return ChatBubbleOutline;
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

export const isOfertaConversacionNotification = (
  tipo: NotificationTipo,
): boolean => OFERTA_CONVERSACION_TIPOS.includes(tipo);

export const isFacturaGrupoNotification = (
  notification: Notificacion,
): boolean => notification.entidad === FACTURA_GRUPO_ENTIDAD;

const getFactoringGrupoDrawerTab = (tipo: NotificationTipo) => {
  if (OFERTA_CONVERSACION_TIPOS.includes(tipo)) return "comentarios";
  if (
    tipo === "OFERTA_ACEPTADA" ||
    tipo === "OFERTA_RECHAZADA" ||
    tipo === "OFERTA_ACTUALIZADA"
  ) {
    return "tu_oferta";
  }
  return "historial";
};

const getEmpresaGrupoDrawerTab = (tipo: NotificationTipo) => {
  if (OFERTA_CONVERSACION_TIPOS.includes(tipo)) return "comentarios";
  return "ofertas";
};

/** Path de drawer de grupo con tab/oferta según el tipo de notificación. */
const getOfertaGrupoDrawerPath = (
  tipo: NotificationTipo,
  currentRole: Role | null,
  facturaGrupoId: string,
  facturaId: string,
  ofertaId?: string | null,
) => {
  if (currentRole?.contexto === "factoring") {
    const tab = getFactoringGrupoDrawerTab(tipo);
    return getFacturaGrupoFactoringPath(facturaGrupoId, {
      facturaId,
      tab,
      ofertaId: tab === "historial" ? ofertaId : null,
    });
  }

  const tab = getEmpresaGrupoDrawerTab(tipo);
  return getFacturaGrupoEmpresaPath(facturaGrupoId, undefined, {
    facturaId,
    tab,
    ofertaId: tab === "ofertas" || tab === "comentarios" ? ofertaId : null,
  });
};

/**
 * Elige una factura del grupo para deep-link de notificaciones de oferta.
 * Prioriza facturas con ofertas recibidas / en estado CON_OFERTAS.
 */
export const pickFacturaForGrupoOfertaNotification = <
  T extends { id: string; estado?: string; numeroOfertasRecibidas?: number },
>(
  facturas: T[],
): T | null => {
  if (!facturas.length) return null;
  return (
    facturas.find((f) => (f.numeroOfertasRecibidas ?? 0) > 0) ??
    facturas.find((f) => (f.estado || "").toUpperCase() === "CON_OFERTAS") ??
    facturas[0] ??
    null
  );
};

export const getNotificationRoute = (
  notification: Notificacion,
  currentRole: Role | null,
  routeContext?: NotificationRouteContext | string | null,
): string | null => {
  const { tipo } = notification;
  // Compat: callers antiguos pasaban solo facturaId como 3er arg.
  const ctx: NotificationRouteContext =
    typeof routeContext === "string" || routeContext == null
      ? { facturaId: routeContext }
      : routeContext;

  if (INVITACION_TIPOS.includes(tipo)) return "/invitations";

  if (isOfertaNotification(tipo)) {
    if (isFacturaGrupoNotification(notification)) {
      if (!notification.entidadId) {
        return currentRole?.contexto === "factoring"
          ? "/marketplace"
          : "/facturas/ofertas";
      }

      const facturaGrupoId = notification.entidadId;
      const facturaId = ctx.facturaId;
      // Para entidad=factura_grupo, entidadId es el grupo — no usarlo como ofertaId.
      const ofertaId = ctx.ofertaId ?? null;

      if (facturaId) {
        return getOfertaGrupoDrawerPath(
          tipo,
          currentRole,
          facturaGrupoId,
          facturaId,
          ofertaId,
        );
      }

      return currentRole?.contexto === "factoring"
        ? getFacturaGrupoFactoringPath(facturaGrupoId)
        : getFacturaGrupoEmpresaPath(facturaGrupoId);
    }

    const facturaId = ctx.facturaId;
    const facturaGrupoId = ctx.facturaGrupoId;
    const ofertaId =
      ctx.ofertaId ??
      (notification.entidadId ? notification.entidadId : null);

    if (facturaGrupoId && facturaId) {
      return getOfertaGrupoDrawerPath(
        tipo,
        currentRole,
        facturaGrupoId,
        facturaId,
        ofertaId,
      );
    }

    if (!facturaId) {
      return currentRole?.contexto === "factoring"
        ? "/marketplace"
        : "/facturas/ofertas";
    }

    if (currentRole?.contexto === "factoring") {
      // La conversación vive en la pestaña "Tu oferta"; el historial no la muestra.
      if (OFERTA_CONVERSACION_TIPOS.includes(tipo)) {
        return `/facturas/${facturaId}/factoring?tab=oferta`;
      }

      const params = new URLSearchParams({ tab: "historial" });
      if (ofertaId) {
        params.set("ofertaId", ofertaId);
      }
      return `/facturas/${facturaId}/factoring?${params.toString()}`;
    }

    const params = new URLSearchParams({ ofertas: "true" });
    if (tipo !== "OFERTA_EXPIRADA" && ofertaId) {
      params.set("ofertaId", ofertaId);
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

/** Orden estable de grupos conocidos por `entidad`. */
const ENTIDAD_ORDER = [
  "oferta",
  "factura_grupo",
  "factura_sync",
  "invitacion",
  "documento_legal",
  "otros",
] as const;

const ENTIDAD_LABELS: Record<string, string> = {
  oferta: "Ofertas",
  factura_grupo: "Grupos de facturas",
  factura_sync: "Sincronización",
  invitacion: "Invitaciones",
  documento_legal: "Documentos legales",
  otros: "Otros",
};

/** Clave de agrupación: solo `entidad` (grupos fijos / predefinidos). */
export const getNotificationGroupKey = (notification: Notificacion): string => {
  const entidad = (notification.entidad || "").trim();
  return entidad || "otros";
};

export const getNotificationEntidadLabel = (entidad: string): string =>
  ENTIDAD_LABELS[entidad] ??
  (entidad
    ? entidad.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())
    : ENTIDAD_LABELS.otros);

export type NotificationTrayGroup = {
  key: string;
  label: string;
  unreadCount: number;
  notifications: Notificacion[];
};

/**
 * Agrupa notificaciones solo por `entidad` (sin entidadId).
 * Dentro de cada grupo se preserva el orden recibido (ya ordenado por fecha).
 * Los grupos conocidos siguen ENTIDAD_ORDER; el resto va al final por recencia.
 */
export const groupNotificationsForTray = (
  notifications: Notificacion[],
): NotificationTrayGroup[] => {
  const groups = new Map<string, Notificacion[]>();

  for (const notification of notifications) {
    const key = getNotificationGroupKey(notification);
    const list = groups.get(key);
    if (list) {
      list.push(notification);
    } else {
      groups.set(key, [notification]);
    }
  }

  const latestTime = (items: Notificacion[]) =>
    items.reduce((max, item) => {
      const t = new Date(item.createdAt).getTime();
      return Number.isNaN(t) ? max : Math.max(max, t);
    }, 0);

  const orderIndex = (key: string) => {
    const idx = ENTIDAD_ORDER.indexOf(
      key as (typeof ENTIDAD_ORDER)[number],
    );
    return idx === -1 ? ENTIDAD_ORDER.length : idx;
  };

  return [...groups.entries()]
    .map(([key, items]) => ({
      key,
      label: getNotificationEntidadLabel(key),
      unreadCount: items.filter((item) => !item.leida).length,
      notifications: items,
    }))
    .sort((a, b) => {
      const orderDiff = orderIndex(a.key) - orderIndex(b.key);
      if (orderDiff !== 0) return orderDiff;
      return latestTime(b.notifications) - latestTime(a.notifications);
    });
};
