export type NotificationTipo =
  | "INVITACION_EMPRESA_RECIBIDA"
  | "INVITACION_EMPRESA_RESPONDIDA"
  | "INVITACION_FACTORING_RECIBIDA"
  | "INVITACION_FACTORING_RESPONDIDA"
  | "OFERTA_RECIBIDA"
  | "OFERTA_NUEVO_COMENTARIO"
  | "OFERTA_RESPONDIDA"
  | "OFERTA_ACTUALIZADA"
  | "OFERTA_ACEPTADA"
  | "OFERTA_RECHAZADA"
  | "OFERTA_EXPIRADA"
  | "FACTURAS_SINCRONIZADAS"
  | "DOCUMENTO_LEGAL_PENDIENTE"
  | "DOCUMENTO_LEGAL_APROBADO"
  | "DOCUMENTO_LEGAL_RECHAZADO";

/** Valores conocidos de `entidad`; se mantiene `string` para valores futuros del backend. */
export type NotificationEntidad =
  | "oferta"
  | "factura_grupo"
  | "factura_sync"
  | (string & {});

export const FACTURA_GRUPO_ENTIDAD = "factura_grupo" as const;

export interface Notificacion {
  id: string;
  userId: string;
  empresaId: string | null;
  factoringId: string | null;
  tipo: NotificationTipo;
  titulo: string;
  mensaje: string;
  entidad: NotificationEntidad;
  entidadId: string;
  leida: boolean;
  readAt: string | null;
  createdAt: string;
  expiresAt: string;
}

export interface NotificacionesResponse {
  count: number;
  notifications: Notificacion[];
}

export type NotificacionContext = {
  empresaId?: string;
  factoringId?: string;
};
