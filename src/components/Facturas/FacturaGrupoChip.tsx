import { Chip } from "@mui/material";
import type { Factura } from "../../types/factura";
import { isFacturaInGrupo } from "../../utils/facturaGrupo";

type FacturaGrupoChipProps = {
  factura: Factura;
};

const FacturaGrupoChip = ({ factura }: FacturaGrupoChipProps) => {
  if (!isFacturaInGrupo(factura)) return null;

  return (
    <Chip
      label={factura.facturaGrupo?.nombre || "Grupo"}
      size="small"
      sx={{
        fontWeight: 500,
        backgroundColor: "var(--color-bg-accent-secondary)",
        color: "var(--color-fg-accent-primary)",
        maxWidth: 180,
        "& .MuiChip-label": {
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }}
    />
  );
};

export default FacturaGrupoChip;
