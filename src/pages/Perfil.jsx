import React from 'react';
import { Container, Typography, Card, CardContent, Box } from '@mui/material';
import PerfilUsuario from '../components/PerfilUsuario';
import PersonIcon from '@mui/icons-material/Person';

export default function Perfil({ session, darkMode, setDarkMode }) {
  if (!session) {
    return (
      <Container maxWidth="sm">
        <Card sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PersonIcon color="primary" fontSize="large" />
              <Typography variant="h5">Perfil de Usuario</Typography>
            </Box>
            <Typography>Debes registrarte para acceder a tu perfil y guardar tus logros.</Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }
  return (
    <Container maxWidth="sm">
      <PerfilUsuario session={session} darkMode={darkMode} setDarkMode={setDarkMode} />
    </Container>
  );
}
