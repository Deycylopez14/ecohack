import React from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import Dashboard from '../components/Dashboard';

export default function Home({ session }) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
            EcoHack
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Estadísticas Globales
          </Typography>
          <Dashboard />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, boxShadow: 3, borderRadius: 4, background: 'linear-gradient(135deg, #e8f5e9 60%, #fffde7 100%)' }}>
            <CardContent>
              <Typography variant="body1" sx={{ fontSize: 20 }}>
                Bienvenido a la app ecológica. <br /> Aprende, juega y contribuye al planeta.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
