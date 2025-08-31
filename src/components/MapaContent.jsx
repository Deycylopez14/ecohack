import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';

const puntos = [
  {
    nombre: 'EcoCentro 1',
    direccion: 'Av. Verde 123',
    horario: 'Lun-Vie 8:00-18:00',
    mapa: 'https://goo.gl/maps/abc123'
  },
  {
    nombre: 'EcoCentro 2',
    direccion: 'Calle Limpia 456',
    horario: 'Lun-Sab 9:00-17:00',
    mapa: 'https://goo.gl/maps/def456'
  }
];

export default function MapaContent() {
  return (
    <Box sx={{ mt: 2, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'info.main', textAlign: 'center' }} gutterBottom>
        <MapIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Puntos de reciclaje cercanos
      </Typography>
      <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ width: '100%' }}>
        {puntos.map((p, i) => (
          <Grid item xs={12} md={6} key={i} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, textAlign: 'center', ':hover': { boxShadow: 6 }, mx: 'auto', width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CardContent sx={{ width: '100%' }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{p.nombre}</Typography>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>Dirección: {p.direccion}</Typography>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>Horario: {p.horario}</Typography>
                <Button variant="contained" color="info" href={p.mapa} target="_blank" sx={{ mt: 2, mx: 'auto', display: 'block', textAlign: 'center' }}>Ver en mapa</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
