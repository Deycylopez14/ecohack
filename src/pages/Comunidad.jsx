
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
      <Card sx={{
        mb: 4,
        boxShadow: 6,
        borderRadius: 6,
        background: 'linear-gradient(135deg, #e0f7fa 60%, #fffde7 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 70% 30%, #a5d6a7 10%, transparent 70%)',
          opacity: 0.18,
          zIndex: 0,
        }} />
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true }}
            navigation={true}
            style={{ width: '100%', minHeight: 180 }}
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fffde7 60%, #a5d6a7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(165,214,167,0.18)',
                    mb: 2,
                  }}>
                    <img src={slide.img} alt={slide.title} style={{ width: 48, height: 48 }} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#388e3c', fontWeight: 800, mb: 1 }}>{slide.title}</Typography>
                  <Typography variant="body1" sx={{ color: '#388e3c', fontWeight: 500 }}>{slide.desc}</Typography>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </CardContent>
      </Card>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'success.dark', mb: 2 }}>
        Comunidad y Gamificación
      </Typography>
      <RetosPreview session={session} requireAuth={requireAuth} />
      <RankingPreview session={session} requireAuth={requireAuth} />
    </Container>
  );
}
