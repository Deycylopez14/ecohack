
import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Fade } from '@mui/material';
import Dashboard from '../components/Dashboard';

export default function Home({ session }) {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e8f5e9 60%, #fffde7 100%)',
      py: { xs: 2, md: 6 },
      px: { xs: 1, md: 0 },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={7}>
            <Fade in timeout={800}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', letterSpacing: 2, color: 'success.main', fontSize: { xs: 40, md: 60 } }}>
                  EcoHack
                </Typography>
                <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary', fontWeight: 500 }}>
                  Estadísticas Globales
                </Typography>
                <Dashboard />
              </Box>
            </Fade>
          </Grid>
          <Grid item xs={12} md={5}>
            <Fade in timeout={1200}>
              <Card sx={{
                p: { xs: 2, md: 4 },
                boxShadow: 4,
                borderRadius: 5,
                background: 'rgba(255,255,255,0.85)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: { xs: 180, md: 260 },
                justifyContent: 'center',
              }}>
                <CardContent sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Ilustración ecológica moderna (árbol, hoja, planeta, etc.) */}
                  <img src="https://cdn-icons-png.flaticon.com/512/427/427735.png" alt="Planeta ecológico" style={{ width: 110, marginBottom: 16, filter: 'drop-shadow(0 2px 8px #a5d6a7)' }} />
                  <Typography variant="h6" sx={{ fontSize: { xs: 20, md: 26 }, color: 'success.dark', fontWeight: 700, mb: 1 }}>
                    ¡Bienvenido a la app ecológica!
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: 16, md: 20 }, color: 'text.primary', fontWeight: 500 }}>
                    Aprende, juega y contribuye al planeta de forma divertida y responsable.
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
