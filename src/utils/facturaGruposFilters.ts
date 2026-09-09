import type { FacturaGrupoVisibilidad } from "../types/factura";

export type FacturaGruposFiltersValues = {
  nombre: string;
  visibilidad: "" | FacturaGrupoVisibilidad;
  porcentajeFinanciamiento: string;
};

export const INITIAL_GRUPO_FILTERS: FacturaGruposFiltersValues = {
  nombre: "",
  visibilidad: "",
  porcentajeFinanciamiento: "",
};

export const isGrupoFilterValueActive = (value: string): boolean => value !== "";

export const readGrupoFiltersFromSearchParams = (
  searchParams: URLSearchParams,
): FacturaGruposFiltersValues => {
  const visibilidad = searchParams.get("visibilidad");
  return {
    nombre: searchParams.get("nombre") || "",
    visibilidad:
      visibilidad === "TODOS" || visibilidad === "SELECCIONADOS"
        ? visibilidad
        : "",
    porcentajeFinanciamiento:
      searchParams.get("porcentajeFinanciamiento") || "",
  };
};
