import type { Role } from '../role/index';
import type { PreferenciaContacto } from '../../utils/validations/shared-fields';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  rut: string;
  roles: Role[];
  // Campos adicionales del perfil
  direccion?: string;
  cargo?: string;
  fechaNacimiento?: string | Date;
  preferenciaContacto?: PreferenciaContacto;
}
