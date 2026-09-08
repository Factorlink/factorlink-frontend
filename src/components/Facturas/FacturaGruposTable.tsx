import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Groups, Visibility } from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useFacturaGrupos } from "../../hooks/useFacturaGrupos";
import type { FacturaGrupo } from "../../types/factura";
import type { Meta } from "../../types/meta";
import {
  paginationSelectSx,
  tableScrollSx,
  tableShellSx,
  tableWideSx,
  toolbarRowSx,
} from "../../theme/layoutStyles";

interface FacturaGruposTableProps {
  empresaId: string;
  onMetaChange?: (meta: Meta) => void;
}

const PAGE_LIMIT = 10;

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const visibilidadLabel = (visibilidad?: string) => {
  if (visibilidad === "SELECCIONADOS") return "Seleccionados";
  if (visibilidad === "TODOS") return "Todos";
  return visibilidad || "—";
};

const FacturaGruposTable = ({
  empresaId,
  onMetaChange,
}: FacturaGruposTableProps) => {
  const navigate = useNavigate();
  const { getFacturaGrupos } = useFacturaGrupos();
  const [grupos, setGrupos] = useState<FacturaGrupo[]>([]);
  const [meta, setMeta] = useState<Meta>({
    lastPage: 1,
    limit: PAGE_LIMIT,
    page: 1,
    total: 0,
    totalCargada: 0,
    totalCedida: 0,
    totalEnMarketplace: 0,
    totalConOfertas: 0,
    totalGeneral: 0,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_LIMIT);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);

  const fetchGrupos = useCallback(async () => {
    if (!empresaId) {
      setLoadingList(false);
      return;
    }
    setLoadError(null);
    setLoadingList(true);
    try {
      const response = await getFacturaGrupos({
        empresaId,
        page,
        limit,
        sortBy: "createdAt",
        order: "DESC",
      });
      const data = response?.data || [];
      setGrupos(data);
      if (response?.meta) {
        setMeta(response.meta);
        onMetaChange?.(response.meta);
      }
    } catch (err) {
      console.error("Error fetching factura grupos:", err);
      setGrupos([]);
      setLoadError("No se pudieron cargar los grupos. Intente nuevamente.");
    } finally {
      setLoadingList(false);
    }
    // getFacturaGrupos is recreated every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empresaId, page, limit]);

  useEffect(() => {
    void fetchGrupos();
  }, [fetchGrupos]);

  const handleLimitChange = (event: SelectChangeEvent) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };

  return (
    <TableContainer component={Paper} sx={tableShellSx}>
      {loadingList ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : grupos.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
          }}
        >
          <Groups
            sx={{ fontSize: 64, color: "var(--color-fg-default-tertiary)", mb: 2 }}
          />
          <Typography
            variant="h6"
            sx={{ color: "var(--color-fg-default-secondary)", fontWeight: 500 }}
          >
            No hay grupos
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-tertiary)", mt: 1 }}
          >
            {loadError ||
              "Los grupos de cotización que crees aparecerán aquí"}
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={tableScrollSx}>
            <Table sx={tableWideSx}>
              <TableHead>
                <TableRow
                  sx={{ backgroundColor: "var(--color-bg-default-tertiary)" }}
                >
                  <TableCell
                    sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}
                  >
                    Nombre
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}
                  >
                    Visibilidad
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}
                  >
                    %
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}
                  >
                    Plazo
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}
                  >
                    Fecha
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: "var(--color-fg-default-secondary)" }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grupos.map((grupo) => (
                  <TableRow
                    key={grupo.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "var(--color-bg-default-tertiary)",
                      },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "var(--color-fg-default-primary)",
                        }}
                      >
                        {grupo.nombre || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: "var(--color-fg-default-secondary)" }}
                      >
                        {visibilidadLabel(grupo.visibilidad)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {grupo.porcentajeFinanciamiento != null
                          ? `${grupo.porcentajeFinanciamiento}%`
                          : "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${grupo.plazo || 0} días`}
                        size="small"
                        sx={{
                          backgroundColor: "var(--color-bg-default-tertiary)",
                          color: "var(--color-fg-default-primary)",
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: "var(--color-fg-default-secondary)" }}
                      >
                        {formatDate(grupo.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Ver detalle">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(`/facturas/grupos/${grupo.id}`, {
                              state: { nombre: grupo.nombre },
                            })
                          }
                          sx={{ color: "var(--color-fg-accent-primary)" }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box
            sx={[
              toolbarRowSx,
              { borderTop: "1px solid var(--color-border-default-primary)" },
            ]}
          >
            <FormControl size="small" sx={paginationSelectSx}>
              <InputLabel id="grupos-limit-label">Filas por página</InputLabel>
              <Select
                labelId="grupos-limit-label"
                value={String(limit)}
                label="Filas por página"
                onChange={handleLimitChange}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            {meta.lastPage > 1 && (
              <Pagination
                count={meta.lastPage}
                page={page}
                onChange={(_e, value) => setPage(value)}
                color="primary"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root.Mui-selected": {
                    color: "var(--color-fg-on-accent-primary)",
                  },
                }}
              />
            )}
          </Box>
        </>
      )}
    </TableContainer>
  );
};

export default FacturaGruposTable;
