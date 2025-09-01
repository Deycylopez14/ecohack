
import React from 'react';
import { Container, Typography, Card, CardContent, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import RetosPreview from '../components/RetosPreview';
import RankingPreview from '../components/RankingPreview';

const slides = [
  {
    img: 'https://cdn-icons-png.flaticon.com/512/616/616494.png',
    title: 'Únete a la comunidad',
    desc: 'Comparte logros, participa en retos y haz nuevos amigos.'
  },
  {
    img: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    title: 'Gamificación ecológica',
    desc: 'Compite en el ranking y suma puntos verdes.'
  },
  {
    img: 'https://cdn-icons-png.flaticon.com/512/2917/2917993.png',
    title: 'Retos colaborativos',
    desc: 'Juntos podemos lograr un mayor impacto ambiental.'
  },
];

export default function Comunidad({ session, requireAuth }) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
  {/* Carrusel y contenido superior eliminado */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'success.dark', mb: 2 }}>
        Comunidad y Gamificación
      </Typography>
      <RetosPreview session={session} requireAuth={requireAuth} />
      <RankingPreview session={session} requireAuth={requireAuth} />
    </Container>
  );
}
