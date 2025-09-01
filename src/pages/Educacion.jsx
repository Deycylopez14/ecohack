
import React from 'react';
import { Container, Typography, Card, CardContent, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import EducacionContent from '../components/EducacionContent';

const slides = [
  {
    img: 'https://cdn-icons-png.flaticon.com/512/2917/2917993.png',
    title: 'Aprende y transforma',
    desc: 'La educación ambiental es el primer paso para cambiar el mundo.'
  },
  {
    img: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    title: 'Conocimiento ecológico',
    desc: 'Descubre tips y datos para cuidar el planeta cada día.'
  },
  {
    img: 'https://cdn-icons-png.flaticon.com/512/427/427735.png',
    title: 'Sé parte del cambio',
    desc: 'Aprender es el primer paso para actuar.'
  },
];

export default function Educacion() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{
        mb: 4,
        boxShadow: 6,
        borderRadius: 6,
        background: 'linear-gradient(135deg, #e0f7fa 60%, #fffde7 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
    {/* Carrusel y contenido superior eliminado */}
      </Card>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'success.dark', mb: 2 }}>
        Módulo Educativo
      </Typography>
      <EducacionContent />
    </Container>
  );
}
