import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Fade } from '@mui/material';
import Dashboard from '../components/Dashboard';

export default function Home({ session }) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Fade in timeout={800}>
            <Box>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', letterSpacing: 2, color: 'success.main' }}>
                EcoHack
              </Typography>
              <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
                Estadísticas Globales
              </Typography>
              <Dashboard />
            </Box>
          </Fade>
        </Grid>
        <Grid item xs={12} md={6}>
          <Fade in timeout={1200}>
            <Card sx={{ p: 3, boxShadow: 3, borderRadius: 4, background: 'linear-gradient(135deg, #e8f5e9 60%, #fffde7 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CardContent>
                <img src="https://cdn-icons-png.flaticon.com/512/2909/2909763.png" alt="Eco" style={{ width: 120, marginBottom: 16 }} />
                <Typography variant="body1" sx={{ fontSize: 20, color: 'text.primary', textAlign: 'center' }}>
                  Bienvenido a la app ecológica.<br />Aprende, juega y contribuye al planeta.
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
}
