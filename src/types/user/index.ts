import type { Role } from '../role/index';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  roles: Role[]
}
