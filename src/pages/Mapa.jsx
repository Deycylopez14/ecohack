import React from 'react';
import { Container, Typography } from '@mui/material';
import MapaReciclaje from '../components/MapaReciclaje';

export default function Mapa({ session, requireAuth }) {
  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Mapa de Puntos de Reciclaje
      </Typography>
      <MapaReciclaje session={session} requireAuth={requireAuth} />
    </Container>
  );
}
