import type { Empresa } from "../empresa";
import type { Factoring } from "../factoring";

export interface Role {
    contexto: string;
    empresaId: string;
    factoringId: string;
    nivel: number;
    role: string;
    empresa?: Empresa;
    factoring?: Factoring;
}
