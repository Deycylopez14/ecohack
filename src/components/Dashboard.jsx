import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

export default function Dashboard() {
  // Datos simulados, luego se conectarán a Supabase
  const stats = {
    botellasRecicladas: 12450,
    impactoCO2: '2.3 toneladas',
    retosActivos: 3,
    logrosDestacados: ['Embajador del Reciclaje', 'Explorador Verde']
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Botellas recicladas</Typography>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>{stats.botellasRecicladas}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Impacto ambiental</Typography>
              <Typography variant="h4" color="secondary" sx={{ fontWeight: 'bold' }}>{stats.impactoCO2}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Retos activos</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stats.retosActivos}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Logros destacados</Typography>
              {stats.logrosDestacados.map((l, i) => (
                <Typography key={i} variant="body1">🎖️ {l}</Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
