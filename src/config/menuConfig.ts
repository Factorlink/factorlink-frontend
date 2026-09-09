import {
  GridView,
  Description,
  SwapHoriz,
  Assessment,
  Settings,
  Logout,
  Storefront,
  Groups,
} from "@mui/icons-material";
import type { SvgIconComponent } from "@mui/icons-material";
import { ROLES } from "../utils/consts";

export interface MenuItem {
  text: string;
  icon: SvgIconComponent;
  path: string;
  roles: string[];
  /** Active when pathname equals path or starts with `${path}/`. */
  matchPrefix?: boolean;
}

const ALL_ROLES = [ROLES.EMPRESA_ADMIN, ROLES.FACTORING_ADMIN, ROLES.DEFAULT, ROLES.EMPRESA_USUARIO, ROLES.FACTORING_ANALISTA];
const ADMIN_ROLES = [ROLES.EMPRESA_ADMIN, ROLES.FACTORING_ADMIN];
const EMPRESA_ROLES = [ROLES.EMPRESA_ADMIN, ROLES.EMPRESA_USUARIO];
const FACTORING_ROLES = [ROLES.FACTORING_ADMIN, ROLES.FACTORING_ANALISTA];

export const mainMenuItems: MenuItem[] = [
  {
    text: "Inicio / Dashboard",
    icon: GridView,
    path: "/dashboard",
    roles: ALL_ROLES,
  },
  {
    text: "Control de Facturas",
    icon: Description,
    path: "/facturas",
    roles: EMPRESA_ROLES,
  },
  {
    text: "Grupos de Facturas",
    icon: Groups,
    path: "/facturas/grupos",
    roles: EMPRESA_ROLES,
    matchPrefix: true,
  },
  {
    text: "Marketplace",
    icon: Storefront,
    path: "/marketplace",
    roles: FACTORING_ROLES,
  },
  {
    text: "Operaciones",
    icon: SwapHoriz,
    path: "/operaciones",
    roles: ADMIN_ROLES,
  },
  {
    text: "Riesgo / Scoring",
    icon: Assessment,
    path: "/#",
    roles: [ROLES.FACTORING_ADMIN],
  },
];

export const bottomMenuItems: MenuItem[] = [
  {
    text: "Configuración",
    icon: Settings,
    path: "/configuracion",
    roles: ADMIN_ROLES,
  },
  {
    text: "Cerrar sesión",
    icon: Logout,
    path: "/login",
    roles: ALL_ROLES,
  },
];

export const isMenuItemActive = (pathname: string, item: MenuItem) => {
  if (item.matchPrefix) {
    return pathname === item.path || pathname.startsWith(`${item.path}/`);
  }
  return pathname === item.path;
};

export const getMenuItemsByRole = (items: MenuItem[], userRole: string): MenuItem[] => {
  return items.filter((item) => item.roles.includes(userRole));
};
