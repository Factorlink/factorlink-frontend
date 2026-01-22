import {
  Box,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  CheckCircleOutline as CheckIcon,
  AccessTime as PendingIcon,
  Cancel as RejectedIcon,
  FileUpload as UploadIcon,
  FileDownload as DownloadIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
} from "@mui/icons-material";

type DocumentStatus = "VALIDADO" | "PENDIENTE" | "RECHAZADO" | "SIN_SUBIR";

interface DocumentRow {
  id: string;
  nombre: string;
  estado: DocumentStatus;
  fechaSubida?: string;
  fechaValidacion?: string;
  bloqueado?: boolean;
}

const dummyData: DocumentRow[] = [
  {
    id: "1",
    nombre: "Escritura de constitución",
    estado: "VALIDADO",
    fechaSubida: "14-01-2024",
    fechaValidacion: "19-01-2024",
    bloqueado: true,
  },
  {
    id: "2",
    nombre: "RUT empresa",
    estado: "PENDIENTE",
    fechaSubida: "17-01-2024",
  },
  {
    id: "3",
    nombre: "Representante legal",
    estado: "SIN_SUBIR",
  },
  {
    id: "4",
    nombre: "Poderes",
    estado: "SIN_SUBIR",
  },
  {
    id: "5",
    nombre: "Otros documentos legales",
    estado: "SIN_SUBIR",
  },
];

const statusConfig: Record<
  DocumentStatus,
  { label: string; color: "success" | "warning" | "error" | "default"; icon: React.ReactNode }
> = {
  VALIDADO: {
    label: "VALIDADO",
    color: "success",
    icon: <CheckIcon fontSize="small" />,
  },
  PENDIENTE: {
    label: "PENDIENTE",
    color: "warning",
    icon: <PendingIcon fontSize="small" />,
  },
  RECHAZADO: {
    label: "RECHAZADO",
    color: "error",
    icon: <RejectedIcon fontSize="small" />,
  },
  SIN_SUBIR: {
    label: "Sin subir",
    color: "default",
    icon: null,
  },
};

const DocumentsTable = () => {
  const renderStatusChip = (estado: DocumentStatus) => {
    const config = statusConfig[estado];

    if (estado === "SIN_SUBIR") {
      return (
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontStyle: "italic" }}
        >
          Sin subir
        </Typography>
      );
    }

    return (
      <Chip
        icon={config.icon as React.ReactElement}
        label={config.label}
        size="small"
        variant="outlined"
        sx={{
          borderColor:
            estado === "VALIDADO"
              ? "success.main"
              : estado === "PENDIENTE"
              ? "warning.main"
              : "error.main",
          color:
            estado === "VALIDADO"
              ? "success.main"
              : estado === "PENDIENTE"
              ? "warning.main"
              : "error.main",
          "& .MuiChip-icon": {
            color: "inherit",
          },
        }}
      />
    );
  };

  const renderActions = (row: DocumentRow) => {
    if (row.estado === "SIN_SUBIR") {
      return (
        <IconButton size="small" sx={{ color: "primary.main" }}>
          <UploadIcon />
        </IconButton>
      );
    }

    if (row.bloqueado) {
      return (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton size="small" sx={{ color: "primary.main" }}>
            <DownloadIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
            <LockIcon fontSize="small" />
            <Typography variant="body2">Bloqueado</Typography>
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton size="small" sx={{ color: "primary.main" }}>
          <DownloadIcon />
        </IconButton>
        <IconButton size="small" sx={{ color: "error.main" }}>
          <DeleteIcon />
        </IconButton>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        p: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600 }}>
          Documentos Legales Requeridos
        </Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          sx={{
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
            color: "white",
          }}
        >
          Subir Documento
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                Documento
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                Estado
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                Fecha de Subida
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((row) => (
              <TableRow key={row.id} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: "rgba(0, 188, 212, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <DescriptionIcon sx={{ color: "primary.main" }} />
                    </Box>
                    <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500 }}>
                      {row.nombre}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{renderStatusChip(row.estado)}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      {row.fechaSubida || "-"}
                    </Typography>
                    {row.fechaValidacion && (
                      <Typography variant="caption" sx={{ color: "success.main" }}>
                        Validado: {row.fechaValidacion}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">{renderActions(row)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DocumentsTable;
