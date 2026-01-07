import type { Empresa } from "../empresa";

export interface Role {
    contexto: string;
    empresaId: string;
    factoringId: string;
    nivel: number;
    role: string;
    empresa?: Empresa;
}
