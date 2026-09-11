import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import {
  Box,
  Chip,
  Drawer,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  ChatBubbleOutline,
  Close,
  InfoOutlined,
  RequestQuote,
} from "@mui/icons-material";
import type { Factura } from "../../types/factura";
import { getFacturaStatusConfig } from "../../theme";
import {
  formatCurrency,
  formatDate,
} from "./FacturaResumenCard";
import DocumentosAsociadosCard from "./DocumentosAsociadosCard";
import FacturaGrupoOfertaForm from "./FacturaGrupoOfertaForm";
import { hasFacturaPdf } from "../../utils/facturaDocuments";
import type { OfertaGrupoBorrador } from "../../utils/facturaGrupoOferta";
import {
  isOfertaCondicionada,
  puedeComentar,
} from "../../utils/ofertaEstados";
import { useOfertas } from "../../hooks/useOfertas";
import ConversacionOferta from "../Ofertas/ConversacionOferta";
import DetalleOfertaFactoring from "../Ofertas/DetalleOfertaFactoring";

type FacturaGrupoFactoringDetalleDrawerProps = {
  open: boolean;
  onClose: () => void;
  factura: Factura | null;
  factoringId: string;
  borrador?: OfertaGrupoBorrador | null;
  onSaveBorrador: (borrador: OfertaGrupoBorrador) => void;
  onDeleteBorrador: (facturaId: string) => void;
  onOfertaActualizada?: () => void;
  sending?: boolean;
  grupoPlazo?: number;
};

type DrawerTab = "informacion" | "tu_oferta" | "comentarios";

const TabPanel = ({
  value,
  current,
  children,
}: {
  value: DrawerTab;
  current: DrawerTab;
  children: ReactNode;
}) => {
  if (value !== current) return null;
  return <Box sx={{ pt: 2 }}>{children}</Box>;
};

const FieldLabel = ({ children }: { children: ReactNode }) => (
  <Typography
    variant="caption"
    sx={{ color: "var(--color-fg-default-secondary)", display: "block" }}
  >
    {children}
  </Typography>
);

const FieldValue = ({
  children,
  emphasize,
}: {
  children: ReactNode;
  emphasize?: boolean;
}) => (
  <Typography
    variant="body2"
    sx={{
      fontWeight: emphasize ? 700 : 600,
      color: emphasize
        ? "var(--color-fg-success-primary)"
        : "var(--color-fg-default-primary)",
      mt: 0.25,
    }}
  >
    {children}
  </Typography>
);

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <Typography
    variant="subtitle2"
    sx={{
      fontWeight: 700,
      color: "var(--color-fg-default-primary)",
      mb: 2,
    }}
  >
    {children}
  </Typography>
);

const StubTabContent = ({ message }: { message: string }) => (
  <Box
    sx={{
      p: 3,
      borderRadius: "var(--radius-m)",
      backgroundColor: "var(--color-bg-default-tertiary)",
      border: "1px solid var(--color-border-default-primary)",
    }}
  >
    <Typography
      variant="body2"
      sx={{ color: "var(--color-fg-default-secondary)" }}
    >
      {message}
    </Typography>
  </Box>
);

const FacturaGrupoFactoringDetalleDrawer = ({
  open,
  onClose,
  factura,
  factoringId,
  borrador,
  onSaveBorrador,
  onDeleteBorrador,
  onOfertaActualizada,
  sending = false,
  grupoPlazo = 0,
}: FacturaGrupoFactoringDetalleDrawerProps) => {
  const [tab, setTab] = useState<DrawerTab>("informacion");
  const { createComentario } = useOfertas();
  const statusConfig = getFacturaStatusConfig(factura?.estado || "");
  const ofertaEnviada = factura?.ofertaFactoring ?? null;
  const hasBorrador = Boolean(borrador);

  useEffect(() => {
    if (open) {
      setTab("informacion");
    }
  }, [open, factura?.id]);

  const handleClose = () => {
    if (sending) return;
    onClose();
  };

  const renderTuOferta = () => {
    if (!factura || !factoringId) {
      return (
        <StubTabContent message="No se pudo cargar el formulario de oferta." />
      );
    }

    if (hasBorrador || !ofertaEnviada) {
      return (
        <FacturaGrupoOfertaForm
          key={factura.id}
          factura={factura}
          factoringId={factoringId}
          borrador={borrador}
          onSave={onSaveBorrador}
          onDelete={() => onDeleteBorrador(factura.id)}
          onCancel={handleClose}
          disabled={sending}
        />
      );
    }

    return (
      <DetalleOfertaFactoring
        key={ofertaEnviada.id}
        oferta={ofertaEnviada}
        plazo={grupoPlazo || factura.plazo || 0}
        onOfertaCancelada={onOfertaActualizada}
        onOfertaFinalEnviada={onOfertaActualizada}
      />
    );
  };

  const renderComentarios = () => {
    if (!ofertaEnviada?.id) {
      return (
        <StubTabContent message="Los comentarios están disponibles cuando la oferta enviada sea condicionada." />
      );
    }

    if (!isOfertaCondicionada(ofertaEnviada)) {
      return (
        <StubTabContent message="Los comentarios están disponibles cuando la oferta enviada sea condicionada." />
      );
    }

    return (
      <ConversacionOferta
        key={ofertaEnviada.id}
        ofertaId={ofertaEnviada.id}
        ladoActual="FACTORING"
        ocultarSiVacia={false}
        puedeComentar={
          !sending &&
          puedeComentar(ofertaEnviada) &&
          isOfertaCondicionada(ofertaEnviada)
        }
        onEnviarComentario={(texto) =>
          createComentario(ofertaEnviada.id, texto)
        }
        placeholderComentario="Escribe tu respuesta..."
        textoBotonEnviar="Enviar comentario"
      />
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={sending}
      slotProps={{
        backdrop: {
          sx: sending ? { pointerEvents: "auto" } : undefined,
        },
      }}
      PaperProps={{
        sx: {
          width: { xs: "100%", md: "75%", lg: "65%" },
          p: { xs: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          mb: 1,
          flexShrink: 0,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "var(--color-fg-default-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {factura?.folio
              ? `Detalle de la factura #${factura.folio}`
              : "Detalle de la factura"}
          </Typography>
          {factura?.razonSocialReceptor && (
            <Typography
              variant="body2"
              sx={{ color: "var(--color-fg-default-secondary)" }}
            >
              {factura.razonSocialReceptor}
            </Typography>
          )}
          {factura?.estado && (
            <Chip
              icon={statusConfig.icon as ReactElement}
              label={statusConfig.label}
              size="small"
              sx={{
                mt: 1,
                backgroundColor: statusConfig.bgColor,
                color: statusConfig.color,
                fontWeight: 500,
                "& .MuiChip-icon": { color: statusConfig.color },
              }}
            />
          )}
        </Box>
        <IconButton
          onClick={handleClose}
          aria-label="Cerrar"
          size="small"
          disabled={sending}
        >
          <Close />
        </IconButton>
      </Box>

      {!factura ? (
        <Box sx={{ py: 4 }}>
          <Typography
            variant="body2"
            sx={{ color: "var(--color-fg-default-secondary)" }}
          >
            No hay factura seleccionada.
          </Typography>
        </Box>
      ) : (
        <>
          <Tabs
            value={tab}
            onChange={(_e, value: DrawerTab) => {
              if (sending) return;
              setTab(value);
            }}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              flexShrink: 0,
              borderBottom: 1,
              borderColor: "divider",
              minHeight: 44,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                minHeight: 44,
              },
            }}
          >
            <Tab
              value="informacion"
              icon={<InfoOutlined sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Información"
              disabled={sending}
            />
            <Tab
              value="tu_oferta"
              icon={<RequestQuote sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Tu oferta"
              disabled={sending}
            />
            <Tab
              value="comentarios"
              icon={<ChatBubbleOutline sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Comentarios"
              disabled={sending}
            />
          </Tabs>

          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              mt: 1,
              pr: 0.5,
              pointerEvents: sending ? "none" : "auto",
              opacity: sending ? 0.7 : 1,
            }}
          >
            <TabPanel value="informacion" current={tab}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <SectionTitle>Información general</SectionTitle>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                      },
                      gap: 2,
                    }}
                  >
                    <Box>
                      <FieldLabel>Folio</FieldLabel>
                      <FieldValue>#{factura.folio || "—"}</FieldValue>
                    </Box>
                    <Box>
                      <FieldLabel>SII ID</FieldLabel>
                      <FieldValue>{factura.siiId || "—"}</FieldValue>
                    </Box>
                    <Box>
                      <FieldLabel>Tipo de documento</FieldLabel>
                      <FieldValue>{factura.tipoDocumento || "—"}</FieldValue>
                    </Box>
                    <Box>
                      <FieldLabel>RUT receptor</FieldLabel>
                      <FieldValue>{factura.rutReceptor || "—"}</FieldValue>
                    </Box>
                    <Box>
                      <FieldLabel>Fecha de emisión</FieldLabel>
                      <FieldValue>
                        {factura.fechaEmision
                          ? formatDate(factura.fechaEmision)
                          : "—"}
                      </FieldValue>
                    </Box>
                    <Box>
                      <FieldLabel>Fecha de recepción</FieldLabel>
                      <FieldValue>
                        {factura.fechaRecepcion
                          ? formatDate(factura.fechaRecepcion)
                          : "—"}
                      </FieldValue>
                    </Box>
                    <Box>
                      <FieldLabel>Estado SII</FieldLabel>
                      {factura.estadoSii ? (
                        <Chip
                          label={factura.estadoSii}
                          size="small"
                          sx={{
                            mt: 0.5,
                            fontWeight: 600,
                            backgroundColor:
                              "var(--color-bg-success-secondary)",
                            color: "var(--color-fg-success-primary)",
                          }}
                        />
                      ) : (
                        <FieldValue>—</FieldValue>
                      )}
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <SectionTitle>Montos del documento</SectionTitle>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                      },
                      gap: 2,
                    }}
                  >
                    <Box>
                      <FieldLabel>Monto neto</FieldLabel>
                      <FieldValue>
                        {formatCurrency(factura.montoNeto)}
                      </FieldValue>
                    </Box>
                    <Box>
                      <FieldLabel>IVA (19%)</FieldLabel>
                      <FieldValue>
                        {formatCurrency(factura.detalleIva)}
                      </FieldValue>
                    </Box>
                    <Box>
                      <FieldLabel>Descuento global</FieldLabel>
                      <FieldValue>
                        {formatCurrency(factura.descuentoGlobal)}
                      </FieldValue>
                    </Box>
                    <Box>
                      <FieldLabel>Monto total</FieldLabel>
                      <FieldValue emphasize>
                        {formatCurrency(factura.montoTotal)}
                      </FieldValue>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  {hasFacturaPdf(factura) ? (
                    <DocumentosAsociadosCard
                      factura={factura}
                      adjuntos={factura.archivos ?? []}
                    />
                  ) : (
                    <>
                      <SectionTitle>Documentos asociados</SectionTitle>
                      <Typography
                        variant="body2"
                        sx={{ color: "var(--color-fg-default-secondary)" }}
                      >
                        No hay PDF asociado a esta factura.
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value="tu_oferta" current={tab}>
              {renderTuOferta()}
            </TabPanel>

            <TabPanel value="comentarios" current={tab}>
              {renderComentarios()}
            </TabPanel>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default FacturaGrupoFactoringDetalleDrawer;
