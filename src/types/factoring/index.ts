import { FACTORING_TYPES } from "../../utils/consts";

export type FactoringType = keyof typeof FACTORING_TYPES;

export interface Factoring {
  id?: string;
  rut: string;
  razonSocial: string;
  tipo: FactoringType;
}
