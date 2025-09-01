
import React from 'react';
import { Container, Typography, Card, CardContent, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import MapaReciclaje from '../components/MapaReciclaje';

const slides = [
  {
    img: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    title: 'Encuentra y recicla',
    desc: 'Localiza puntos de reciclaje cercanos y contribuye al planeta.'
  },
  {
    img: 'https://cdn-icons-png.flaticon.com/512/427/427735.png',
    title: 'Mapa ecológico',
    desc: 'Descubre lugares donde puedes reciclar y sumar tu impacto.'
  },
  {
    img: 'https://cdn-icons-png.flaticon.com/512/616/616494.png',
    title: 'Actúa localmente',
    desc: 'Cada acción en tu comunidad cuenta para el mundo.'
  },
];

export default function Mapa({ session, requireAuth }) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
  {/* Carrusel y contenido superior eliminado */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'success.dark', mb: 2 }}>
        Mapa de Puntos de Reciclaje
      </Typography>
      <MapaReciclaje session={session} requireAuth={requireAuth} />
    </Container>
  );
}
