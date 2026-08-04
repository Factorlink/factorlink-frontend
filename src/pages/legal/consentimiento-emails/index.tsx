import { Box, Container, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import {
  legalHeadingSx,
  legalPageSx,
  legalPaperSx,
  legalSectionHeadingSx,
} from "../../../theme";

const ConsentimientoEmails = () => {
  return (
    <Box sx={legalPageSx}>
      <Container maxWidth="md">
        <Paper sx={legalPaperSx}>
          <Typography variant="h4" gutterBottom sx={legalHeadingSx}>
            Consentimiento para el Envío de Correos Electrónicos (Opt-In)
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={legalSectionHeadingSx}>
              Texto de consentimiento
            </Typography>
            <Typography paragraph color="text.secondary">
              Al registrarte en nuestra plataforma, puedes autorizar el envío de comunicaciones por correo electrónico.
            </Typography>
            <Typography color="text.secondary" fontWeight={500}>
              El consentimiento incluye:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Información relevante sobre el uso de la plataforma" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Novedades, actualizaciones y mejoras" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Comunicaciones comerciales o promocionales relacionadas con nuestros servicios" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography color="text.secondary" fontWeight={500}>
              El consentimiento es:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Voluntario" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Específico" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Informado" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Revocable en cualquier momento" 
                  primaryTypographyProps={{ color: "text.secondary" }}
                />
              </ListItem>
            </List>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ConsentimientoEmails;
