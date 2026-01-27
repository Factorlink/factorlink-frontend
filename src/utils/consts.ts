export const ROLES = {
  EMPRESA_ADMIN: "EMPRESA_ADMIN",
  EMPRESA_USUARIO: "EMPRESA_USUARIO",
  FACTORING_ADMIN: "FACTORING_ADMIN",
  FACTORING_ANALISTA: "FACTORING_ANALISTA",
  DEFAULT: "DEFAULT",
};

export const FACTORING_TYPES = {
  TRADICIONAL: "Tradicional",
  DIGITAL: "Digital",
  BANCARIO: "Bancario",
} as const;

export const ENTITY_TYPES = {
  EMPRESA: "EMPRESA",
  FACTORING: "FACTORING",
} as const;

export const ROLE_NAMES = {
  [ROLES.EMPRESA_ADMIN]: "Administrador de Empresa",
  [ROLES.EMPRESA_USUARIO]: "Usuario de Empresa",
  [ROLES.FACTORING_ADMIN]: "Administrador de Factoring",
  [ROLES.FACTORING_ANALISTA]: "Analista de Factoring",
  [ROLES.DEFAULT]: "Usuario por Defecto",
}

type DocumentItem = { id: string; label: string };

export const EMPRESA_DOCUMENTOS: DocumentItem[] = [
  { id: "escritura_constitucion", label: "Escritura de constitución" },
  { id: "rut", label: "RUT empresa" },
  { id: "representante_legal", label: "Representante legal" },
  { id: "poderes", label: "Poderes" },
  { id: "otros_documentos_legales", label: "Otros documentos legales" },
];

export const FACTORING_DOCUMENTOS: DocumentItem[] = [
  { id: "escritura_constitucion", label: "Escritura de constitución" },
  { id: "rut", label: "RUT factoring" },
  { id: "representante_legal", label: "Representante legal" },
  { id: "poderes", label: "Poderes" },
  { id: "documentacion_regulatoria", label: "Documentación regulatoria" },
];

export const DOCUMENT_NAMES = {
  escritura_constitucion: "Escritura de constitución",
  rut: "RUT",
  representante_legal: "Representante legal",
  poderes: "Poderes",
  otros_documentos_legales: "Otros documentos legales",
  documentacion_regulatoria: "Documentación regulatoria",
};

export const DOCUMENT_STATES = {
  PENDIENTE: "PENDIENTE",
  RECHAZADO: "RECHAZADO",
  APROBADO: "APROBADO",
};

export const FACTORING_STATES = {
  PENDIENTE: "PENDIENTE",
  VALIDACION: "VALIDACION",
  ACTIVO: "ACTIVO",
}
