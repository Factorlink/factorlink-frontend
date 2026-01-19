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
  direccion?: string;
  cargo?: string;
  fechaNacimiento?: string | Date;
  preferenciaContacto?: PreferenciaContacto;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isCurrentUser?: boolean;
}
