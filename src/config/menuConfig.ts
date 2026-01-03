import {
  GridView,
  Description,
  SwapHoriz,
  Assessment,
  Settings,
  Logout,
} from "@mui/icons-material";
import type { SvgIconComponent } from "@mui/icons-material";
import { ROLES } from "../utils/consts";

export interface MenuItem {
  text: string;
  icon: SvgIconComponent;
  path: string;
  roles: string[];
}

const ALL_ROLES = [ROLES.EMPRESA_ADMIN, ROLES.FACTORING_ADMIN, ROLES.DEFAULT];

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
    roles: ALL_ROLES,
  },
  {
    text: "Operaciones",
    icon: SwapHoriz,
    path: "/operaciones",
    roles: [ROLES.EMPRESA_ADMIN, ROLES.FACTORING_ADMIN],
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
    roles: [ROLES.EMPRESA_ADMIN, ROLES.FACTORING_ADMIN],
  },
  {
    text: "Logout",
    icon: Logout,
    path: "/login",
    roles: ALL_ROLES,
  },
];

export const getMenuItemsByRole = (items: MenuItem[], userRole: string): MenuItem[] => {
  return items.filter((item) => item.roles.includes(userRole));
};
