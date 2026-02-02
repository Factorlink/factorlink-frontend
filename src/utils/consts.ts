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

const DOCUMENTOS: DocumentItem[] = [
  { id: "escritura_constitucion", label: "Escritura de constitución" },
  { id: "representante_legal", label: "Representante legal" },
  { id: "poderes", label: "Poderes" },
  { id: "otros_documentos_legales", label: "Otros documentos legales" },
]

export const EMPRESA_DOCUMENTOS: DocumentItem[] = [
  { id: "rut", label: "RUT empresa" },
  ...DOCUMENTOS,
];

export const FACTORING_DOCUMENTOS: DocumentItem[] = [
  { id: "rut", label: "RUT factoring" },
  ...DOCUMENTOS,
];

export const DOCUMENT_NAMES = {
  escritura_constitucion: "Escritura de constitución",
  rut: "RUT",
  representante_legal: "Representante legal",
  poderes: "Poderes",
  otros_documentos_legales: "Otros documentos legales",
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

export const FACTURAS_STATES = [
  { value: "CARGADA", label: "Cargada" },
  { value: "EN_MARKETPLACE", label: "En Marketplace" },
  { value: "CON_OFERTAS", label: "Con Ofertas" },
  { value: "CEDIDA", label: "Cedida" },
  { value: "EN_COBRANZA", label: "En Cobranza" },
  { value: "COBRADA", label: "Cobrada" },
  { value: "NO_COBRADA", label: "No Cobrada" },
];
