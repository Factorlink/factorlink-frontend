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

