
import React from 'react';
import { Container, Typography, Card, CardContent, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import QuizClasificacion from '../components/QuizClasificacion';
import SimuladorImpacto from '../components/SimuladorImpacto';

const slides = [
  {
    img: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png',
    title: '¡Juega y aprende!',
    desc: 'Diviértete con minijuegos ecológicos y reta a tus amigos.'
  },
  {
    img: 'https://cdn-icons-png.flaticon.com/512/2917/2917993.png',
    title: 'Desafía tu mente',
    desc: 'Pon a prueba tus conocimientos sobre reciclaje y sostenibilidad.'
  },
  {
    img: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    title: 'Gana puntos verdes',
    desc: 'Acumula logros y compite en el ranking ecológico.'
  },
];

export default function Minijuegos({ session, requireAuth }) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
  {/* Carrusel y contenido superior eliminado */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'success.dark', mb: 2 }}>
        Minijuegos
      </Typography>
      <QuizClasificacion session={session} requireAuth={requireAuth} />
      <SimuladorImpacto session={session} requireAuth={requireAuth} />
    </Container>
  );
}
