import { ROLES } from "./consts";

export const getRoleNameByCode = (roleCode: string) => {
  return (ROLES as Record<string, string>)[roleCode] || ROLES.DEFAULT;
}
