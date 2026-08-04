import { Box, Container, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import {
  legalHeadingSx,
  legalPageSx,
  legalPaperSx,
  legalSectionHeadingSx,
} from "../../../theme";

const TerminosCondiciones = () => {
  return (
    <Box sx={legalPageSx}>
      <Container maxWidth="md">
        <Paper sx={legalPaperSx}>
          <Typography variant="h4" gutterBottom sx={legalHeadingSx}>
            Términos y Condiciones de Uso
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              1. Introducción
            </Typography>
            <Typography paragraph color="text.secondary">
              Bienvenido/a a nuestra plataforma. Al registrarte y utilizar nuestros servicios, aceptas cumplir estos Términos y Condiciones. Si no estás de acuerdo con alguno de ellos, debes abstenerte de utilizar la plataforma.
            </Typography>
            <Typography paragraph color="text.secondary">
              El uso de la plataforma implica la aceptación expresa de estos términos y de nuestra Política de Privacidad.
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              2. Uso de la plataforma
            </Typography>
            <Typography paragraph color="text.secondary">
              El usuario se compromete a utilizar la plataforma de manera responsable, conforme a la ley vigente y a los fines para los cuales fue creada.
            </Typography>
            <Typography color="text.secondary" fontWeight={500}>
              Queda prohibido:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Proporcionar información falsa o incompleta" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Utilizar la plataforma para actividades ilícitas" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Intentar vulnerar la seguridad o funcionamiento del sistema" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              3. Registro de usuarios
            </Typography>
            <Typography paragraph color="text.secondary">
              Para acceder a ciertas funcionalidades, es necesario crear una cuenta proporcionando información veraz y actualizada.
            </Typography>
            <Typography paragraph color="text.secondary">
              El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas desde su cuenta.
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              4. Comunicaciones electrónicas
            </Typography>
            <Typography paragraph color="text.secondary">
              Al registrarse, el usuario podrá recibir comunicaciones electrónicas relacionadas con:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Uso y funcionamiento de la plataforma" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Notificaciones operativas o transaccionales" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Información relevante sobre servicios, mejoras o cambios" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
            </List>
            <Typography paragraph color="text.secondary">
              Las comunicaciones de carácter comercial o de marketing solo se enviarán cuando el usuario haya otorgado su consentimiento explícito.
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              5. Cancelación y baja
            </Typography>
            <Typography paragraph color="text.secondary">
              El usuario puede solicitar la baja de la plataforma o dejar de recibir comunicaciones comerciales en cualquier momento mediante:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="El enlace de cancelación incluido en cada correo electrónico" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Los medios de contacto indicados en la plataforma" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              6. Modificaciones
            </Typography>
            <Typography paragraph color="text.secondary">
              Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones serán publicadas en esta misma página y entrarán en vigor desde su publicación.
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              7. Contacto
            </Typography>
            <Typography paragraph color="text.secondary">
              Para cualquier consulta relacionada con estos Términos y Condiciones, el usuario puede contactarnos a través de los canales oficiales de la plataforma.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TerminosCondiciones;
