import React from 'react';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const retos = [
  { titulo: 'Recicla 5 botellas', descripcion: 'Recicla al menos 5 botellas esta semana.', activo: true },
  { titulo: 'Visita 2 puntos de reciclaje', descripcion: 'Conoce y verifica dos puntos de reciclaje.', activo: true },
  { titulo: 'Composta en casa', descripcion: 'Inicia tu compostaje doméstico.', activo: false },
];

export default function RetosPreview({ session, requireAuth }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>Retos disponibles</Typography>
      <Grid container spacing={2}>
        {retos.map((r, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Card sx={{ boxShadow: 2, borderRadius: 3, transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmojiEventsIcon color={r.activo ? 'success' : 'disabled'} />
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>{r.titulo}</Typography>
                </Box>
                <Typography>{r.descripcion}</Typography>
                <Typography variant="body2" color={r.activo ? 'success.main' : 'text.secondary'}>
                  {r.activo ? 'Activo' : 'Finalizado'}
                </Typography>
                {!session && (
                  <Button variant="outlined" color="secondary" sx={{ mt: 1 }} onClick={() => requireAuth('Únete a retos y guarda tu progreso ecológico.')}>Regístrate para participar</Button>
                )}
                {session && (
                  <Button variant="contained" color="primary" sx={{ mt: 1 }}>Unirse al reto</Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
