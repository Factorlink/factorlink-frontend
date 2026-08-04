import { Box, Container, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import {
  legalHeadingSx,
  legalPageSx,
  legalPaperSx,
  legalSectionHeadingSx,
} from "../../../theme";

const PoliticaPrivacidad = () => {
  return (
    <Box sx={legalPageSx}>
      <Container maxWidth="md">
        <Paper sx={legalPaperSx}>
          <Typography variant="h4" gutterBottom sx={legalHeadingSx}>
            Política de Privacidad
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              1. Introducción
            </Typography>
            <Typography paragraph color="text.secondary">
              La presente Política de Privacidad describe cómo recopilamos, utilizamos y protegemos los datos personales de los usuarios que se registran y utilizan nuestra plataforma.
            </Typography>
            <Typography paragraph color="text.secondary">
              Nos comprometemos a tratar los datos personales de forma confidencial y segura.
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              2. Datos recopilados
            </Typography>
            <Typography paragraph color="text.secondary">
              Podemos recopilar los siguientes datos personales:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Nombre" primaryTypographyProps={{ color: "text.secondary" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Dirección de correo electrónico" primaryTypographyProps={{ color: "text.secondary" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Información de contacto" primaryTypographyProps={{ color: "text.secondary" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Dirección IP" primaryTypographyProps={{ color: "text.secondary" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Datos técnicos asociados al uso de la plataforma" primaryTypographyProps={{ color: "text.secondary" }} />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              3. Uso de la información
            </Typography>
            <Typography paragraph color="text.secondary">
              Los datos personales se utilizan para:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Gestionar el acceso y uso de la plataforma" primaryTypographyProps={{ color: "text.secondary" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Enviar comunicaciones operativas o transaccionales" primaryTypographyProps={{ color: "text.secondary" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Enviar comunicaciones comerciales o de marketing, cuando exista consentimiento expreso" primaryTypographyProps={{ color: "text.secondary" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Mejorar nuestros servicios y la experiencia del usuario" primaryTypographyProps={{ color: "text.secondary" }} />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              4. Consentimiento para comunicaciones
            </Typography>
            <Typography paragraph color="text.secondary">
              El envío de comunicaciones comerciales se realiza únicamente cuando el usuario ha otorgado un consentimiento claro, explícito y verificable mediante un sistema de opt-in.
            </Typography>
            <Typography paragraph color="text.secondary">
              El consentimiento se obtiene a través de un formulario donde el usuario acepta voluntariamente recibir comunicaciones, mediante una casilla de verificación no marcada por defecto.
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              5. Prueba de consentimiento (opt-in)
            </Typography>
            <Typography paragraph color="text.secondary">
              Como prueba del consentimiento otorgado, la plataforma almacena de forma segura la siguiente información asociada a cada contacto:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Fecha y hora de la suscripción" primaryTypographyProps={{ color: "text.secondary" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Dirección IP del suscriptor" primaryTypographyProps={{ color: "text.secondary" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Enlace o identificador del formulario utilizado" primaryTypographyProps={{ color: "text.secondary" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Texto exacto del consentimiento aceptado por el usuario" primaryTypographyProps={{ color: "text.secondary" }} />
              </ListItem>
            </List>
            <Typography paragraph color="text.secondary">
              Esta información se conserva mientras el usuario permanezca suscrito.
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              6. Doble opt-in (opcional)
            </Typography>
            <Typography paragraph color="text.secondary">
              En algunos casos, la plataforma puede utilizar un sistema de doble opt-in, enviando un correo de confirmación adicional para validar la suscripción antes de enviar comunicaciones de marketing.
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              7. Revocación del consentimiento
            </Typography>
            <Typography paragraph color="text.secondary">
              El usuario puede retirar su consentimiento en cualquier momento sin costo alguno, utilizando el enlace de baja incluido en cada correo electrónico o contactando al soporte de la plataforma.
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              8. Seguridad de la información
            </Typography>
            <Typography paragraph color="text.secondary">
              Aplicamos medidas técnicas y organizativas para proteger los datos personales contra accesos no autorizados, pérdida o uso indebido.
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              9. Cambios en la política
            </Typography>
            <Typography paragraph color="text.secondary">
              Nos reservamos el derecho de modificar esta Política de Privacidad. Cualquier cambio será publicado en esta página.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PoliticaPrivacidad;
