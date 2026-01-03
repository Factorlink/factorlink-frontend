import { ROLES } from "./consts";

export const getRoleNameByCode = (roleCode: string) => {
  return (ROLES as Record<string, string>)[roleCode] || ROLES.DEFAULT;
}

export const capitalizeString = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
