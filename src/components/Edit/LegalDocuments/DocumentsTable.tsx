import { useState, useEffect } from "react";
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
import UploadDocumentModal from "../../Modals/UploadDocumentModal";
import DeleteDocumentModal from "../../Modals/DeleteDocumentModal";
import DownloadDocumentModal from "../../Modals/DownloadDocumentModal";
import { useLegalDocuments } from "../../../hooks/useLegalDocuments";
import useAuthStore from "../../../store/authStore";
import { DOCUMENT_NAMES } from "../../../utils/consts";
import { capitalizeFirstLetter } from "../../../utils/utils";

type DocumentStatus = "aprobado" | "pendiente" | "rechazado" | "sin_subir";

interface DocumentRow {
  id: string;
  createdAt: string;
  empresaId?: string;
  estadoValidacion: DocumentStatus;
  factoringId?: string;
  tipo?: string;
  nombreArchivo?: string;
}

const statusConfig: Record<
  DocumentStatus,
  {
    label: string;
    color: "success" | "warning" | "error" | "default";
    icon: React.ReactNode;
  }
> = {
  aprobado: {
    label: "Aprobado",
    color: "success",
    icon: <CheckIcon fontSize="small" />,
  },
  pendiente: {
    label: "Pendiente",
    color: "warning",
    icon: <PendingIcon fontSize="small" />,
  },
  rechazado: {
    label: "Rechazado",
    color: "error",
    icon: <RejectedIcon fontSize="small" />,
  },
  sin_subir: {
    label: "Sin subir",
    color: "default",
    icon: null,
  },
};

const DocumentsTable = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string;
    nombre: string;
  } | null>(null);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const { currentRole } = useAuthStore();
  const { getLegalDocumentsByFactoringId, getLegalDocumentsByEmpresaId } =
    useLegalDocuments();

  const renderStatusChip = (estado: DocumentStatus) => {
    const config = statusConfig[estado];

    if (estado === "sin_subir") {
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
            estado === "aprobado"
              ? "success.main"
              : estado === "pendiente"
                ? "warning.main"
                : "error.main",
          color:
            estado === "aprobado"
              ? "success.main"
              : estado === "pendiente"
                ? "warning.main"
                : "error.main",
          "& .MuiChip-icon": {
            color: "inherit",
          },
        }}
      />
    );
  };

  const getDocumentDisplayName = (row: DocumentRow) => {
    return `${DOCUMENT_NAMES[row.tipo as keyof typeof DOCUMENT_NAMES]} ${row.tipo === "rut" ? capitalizeFirstLetter(currentRole?.contexto || "") : ""}` || "-";
  };

  const handleDownloadClick = (row: DocumentRow) => {
    setSelectedDocument({
      id: row.id,
      nombre: getDocumentDisplayName(row),
    });
    setDownloadModalOpen(true);
  };

  const handleDeleteClick = (row: DocumentRow) => {
    setSelectedDocument({
      id: row.id,
      nombre: getDocumentDisplayName(row),
    });
    setDeleteModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    fetchDocuments();
    setDeleteModalOpen(false);
    setSelectedDocument(null);
  };

  const renderActions = (row: DocumentRow) => {
    if (row.estadoValidacion === "sin_subir") {
      return (
        <IconButton
          size="small"
          sx={{ color: "primary.main" }}
          onClick={() => setUploadModalOpen(true)}
        >
          <UploadIcon />
        </IconButton>
      );
    }

    if (row.estadoValidacion === "aprobado") {
      return (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            sx={{ color: "primary.main" }}
            onClick={() => handleDownloadClick(row)}
          >
            <DownloadIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
            }}
          >
            <LockIcon fontSize="small" />
            <Typography variant="body2">Bloqueado</Typography>
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton
          size="small"
          sx={{ color: "primary.main" }}
          onClick={() => handleDownloadClick(row)}
        >
          <DownloadIcon />
        </IconButton>
        <IconButton
          size="small"
          sx={{ color: "error.main" }}
          onClick={() => handleDeleteClick(row)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    );
  };

  const fetchDocuments = async () => {
    try {
      const documents =
        currentRole?.contexto === "empresa"
          ? await getLegalDocumentsByEmpresaId(currentRole?.empresaId || "")
          : await getLegalDocumentsByFactoringId(
              currentRole?.factoringId || "",
            );
      setDocuments(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleUploadSuccess = () => {
    fetchDocuments();
    setUploadModalOpen(false);
  };

  const canOperate = () => {
      return (Number(currentRole?.nivel) || 0) >= 2 ||  currentRole?.factoring?.estadoEnrolamiento;
    }

  useEffect(() => {
    fetchDocuments();
  }, []);

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
        <Typography
          variant="h6"
          sx={{ color: "text.primary", fontWeight: 600 }}
        >
          Documentos Legales Requeridos
        </Typography>
        {canOperate() && (
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setUploadModalOpen(true)}
            sx={{
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
              color: "white",
            }}
          >
            Subir Documento
          </Button>
        )}
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
            {documents.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
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
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ color: "text.primary", fontWeight: 500 }}
                      >
                        {getDocumentDisplayName(row)}
                      </Typography>
                      {row.tipo === "otros_documentos_legales" && row.nombreArchivo && (
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", fontStyle: "italic" }}
                        >
                          {row.nombreArchivo}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {renderStatusChip(row.estadoValidacion || "sin_subir")}
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "-"}
                    </Typography>
                    {row.estadoValidacion === "aprobado" && (
                      <Typography
                        variant="caption"
                        sx={{ color: "success.main" }}
                      >
                        Aprobado:{" "}
                        {row?.createdAt
                          ? new Date(row.createdAt).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              },
                            )
                          : "-"}
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

      <UploadDocumentModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      {selectedDocument && (
        <>
          <DeleteDocumentModal
            open={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setSelectedDocument(null);
            }}
            onSuccess={handleDeleteSuccess}
            documentData={selectedDocument}
          />

          <DownloadDocumentModal
            open={downloadModalOpen}
            onClose={() => {
              setDownloadModalOpen(false);
              setSelectedDocument(null);
            }}
            documentData={selectedDocument}
          />
        </>
      )}
    </Box>
  );
};

export default DocumentsTable;
