import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const minijuegos = [
  {
    nombre: 'EcoTrivia',
    descripcion: 'Responde preguntas sobre reciclaje y medio ambiente.',
    jugar: '/minijuegos/trivia'
  },
  {
    nombre: 'Separación Express',
    descripcion: 'Arrastra los residuos al contenedor correcto.',
    jugar: '/minijuegos/separacion'
  },
  {
    nombre: 'EcoMemory',
    descripcion: 'Encuentra pares de residuos y su contenedor.',
    jugar: '/minijuegos/memory'
  }
];

export default function MinijuegosContent() {
  return (
    <Box sx={{ mt: 2, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main', textAlign: 'center' }} gutterBottom>
        <EmojiEventsIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Minijuegos ecológicos
      </Typography>
      <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ width: '100%' }}>
        {minijuegos.map((juego, i) => (
          <Grid item xs={12} md={4} key={i} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, textAlign: 'center', ':hover': { boxShadow: 6 }, mx: 'auto', width: '100%', maxWidth: 350, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CardContent sx={{ width: '100%' }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{juego.nombre}</Typography>
                <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>{juego.descripcion}</Typography>
                <Button variant="contained" color="success" href={juego.jugar} sx={{ mx: 'auto', display: 'block', textAlign: 'center' }}>Jugar</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
