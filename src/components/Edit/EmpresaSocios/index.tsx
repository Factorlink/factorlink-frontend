import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import { useEmpresa } from "../../../hooks/useEmpresa";
import useAuthStore from "../../../store/authStore";
import type { EmpresaSocio } from "../../../types/empresa";
import { capitalizeFirstLetter } from "../../../utils/utils";
import { surface } from "../../../theme";
import {
  tableCompactSx,
  tableScrollSx,
  tableShellSx,
} from "../../../theme/layoutStyles";

const headerCellSx = {
  fontWeight: 600,
  color: "var(--color-fg-default-secondary)",
  textTransform: "uppercase",
  fontSize: "0.75rem",
} as const;

const isSocio = (socio: EmpresaSocio) => socio.tipo?.toUpperCase() === "SOCIO";

const getRelacionLabel = (tipo?: string) => {
  const normalized = (tipo || "").toUpperCase();
  if (normalized === "SOCIO") return "Socio";
  if (normalized === "CONTRIBUYENTE") return "Contribuyente";
  return tipo ? capitalizeFirstLetter(tipo.toLowerCase()) : "—";
};

const getRolLabel = (socio: EmpresaSocio) => {
  if (!socio.exist_users) return "—";
  return isSocio(socio) ? "Master" : "Usuario";
};

const getAccesoLabel = (socio: EmpresaSocio) => {
  if (!socio.exist_users) return "Sin acceso";
  return socio.message?.trim() || "Con acceso";
};

const EmpresaSocios = () => {
  const { currentRole } = useAuthStore();
  const { getEmpresaSocios, loading } = useEmpresa();
  const [socios, setSocios] = useState<EmpresaSocio[]>([]);
  const [error, setError] = useState<string | null>(null);

  const empresaId = currentRole?.empresaId;
  const isMaster = Boolean(currentRole?.isMaster);

  useEffect(() => {
    if (!empresaId) return;

    const fetchSocios = async () => {
      try {
        setError(null);
        const data = await getEmpresaSocios(empresaId);
        setSocios(Array.isArray(data) ? data : []);
      } catch {
        setError("No se pudieron cargar los socios y contribuyentes.");
        setSocios([]);
      }
    };

    void fetchSocios();
  }, [empresaId]);

  const canShowUnlink = (socio: EmpresaSocio) =>
    isMaster && socio.exist_users && !isSocio(socio);

  return (
    <Box sx={{ ...surface.card, p: 3, overflow: "hidden" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Box
          sx={{
            backgroundColor: "var(--color-bg-default-tertiary)",
            borderRadius: "var(--radius-m)",
            p: 1.25,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GroupsIcon
            sx={{ color: "var(--color-fg-default-secondary)", fontSize: 24 }}
          />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "var(--color-fg-default-primary)" }}
          >
            Socios y contribuyentes
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            Personas asociadas a la empresa según la sincronización con el SII
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "var(--radius-m)" }}>
          {error}
        </Alert>
      )}

      <TableContainer sx={tableShellSx}>
        <Box sx={tableScrollSx}>
          <Table sx={tableCompactSx}>
            <TableHead>
              <TableRow
                sx={{ backgroundColor: "var(--color-bg-default-tertiary)" }}
              >
                <TableCell sx={headerCellSx}>Nombre / Razón social</TableCell>
                <TableCell sx={headerCellSx}>RUT</TableCell>
                <TableCell sx={headerCellSx}>Relación</TableCell>
                <TableCell sx={headerCellSx}>Usuario Factorlink</TableCell>
                <TableCell sx={headerCellSx}>Rol</TableCell>
                <TableCell sx={headerCellSx}>Acceso</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && socios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : socios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--color-fg-default-secondary)" }}
                    >
                      No hay socios ni contribuyentes sincronizados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                socios.map((socio) => {
                  const rol = getRolLabel(socio);
                  return (
                    <TableRow key={socio.id} hover>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "var(--color-fg-default-primary)",
                          }}
                        >
                          {socio.nombreSocio || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--color-fg-default-secondary)" }}
                        >
                          {socio.rutSocio || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getRelacionLabel(socio.tipo)}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            backgroundColor: isSocio(socio)
                              ? "var(--color-bg-accent-secondary)"
                              : "var(--color-bg-neutral-secondary)",
                            color: isSocio(socio)
                              ? "var(--color-fg-accent-primary)"
                              : "var(--color-fg-default-secondary)",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--color-fg-default-secondary)" }}
                        >
                          {socio.exist_users ? socio.email || "Sí" : "No"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={rol}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            backgroundColor:
                              rol === "Master"
                                ? "var(--color-bg-success-secondary)"
                                : "var(--color-bg-neutral-secondary)",
                            color:
                              rol === "Master"
                                ? "var(--color-fg-success-primary)"
                                : "var(--color-fg-default-secondary)",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--color-fg-default-secondary)" }}
                        >
                          {getAccesoLabel(socio)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {canShowUnlink(socio) ? (
                          <Tooltip title="La desvinculación de acceso se habilitará próximamente">
                            <span>
                              <Button
                                size="small"
                                variant="outlined"
                                disabled
                                sx={{
                                  textTransform: "none",
                                  fontWeight: 600,
                                  borderRadius: "var(--radius-m)",
                                }}
                              >
                                Desvincular
                              </Button>
                            </span>
                          </Tooltip>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{ color: "var(--color-fg-default-secondary)" }}
                          >
                            —
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>
    </Box>
  );
};

export default EmpresaSocios;
