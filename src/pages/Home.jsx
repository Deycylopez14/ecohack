
import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Fade, Paper } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Dashboard from '../components/Dashboard';


export default function Home({ session }) {
  // Ejemplo de datos de estadísticas
  const stats = [
    {
      label: 'Eco-Hackers Activos',
      value: '1,245',
      icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png', // usuario
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
      label: 'Retos Completados',
      value: '3,210',
      icon: 'https://cdn-icons-png.flaticon.com/512/616/616494.png', // trofeo
      color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    },
    {
      label: 'Kg de CO₂ Reducidos',
      value: '8,500',
      icon: 'https://cdn-icons-png.flaticon.com/512/427/427735.png', // planeta
      color: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
    },
    {
      label: 'Minijuegos Jugados',
      value: '5,430',
      icon: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png', // juego
      color: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
    },
  ];

  // Carrusel motivacional y de apartados principales
  const slides = [
    {
      img: 'https://cdn-icons-png.flaticon.com/512/427/427735.png',
      title: '¡Bienvenido a EcoHack!',
      desc: 'Únete a la comunidad que cuida el planeta de forma divertida y educativa.'
    },
    {
      img: 'https://cdn-icons-png.flaticon.com/512/616/616494.png',
      title: 'Comunidad',
      desc: 'Conecta con otros eco-hackers, comparte logros y participa en retos ecológicos.'
    },
    {
      img: 'https://cdn-icons-png.flaticon.com/512/2917/2917993.png',
      title: 'Educación',
      desc: 'Aprende sobre reciclaje, sostenibilidad y el impacto ambiental.'
    },
    {
      img: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      title: 'Mapa de Reciclaje',
      desc: 'Encuentra puntos de reciclaje cercanos y contribuye a la comunidad.'
    },
    {
      img: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png',
      title: 'Minijuegos',
      desc: 'Diviértete mientras aprendes y ganas puntos ecológicos.'
    },
    {
      img: 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png',
      title: 'Perfil',
      desc: 'Visualiza tu progreso, logros y estadísticas personales.'
    },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e8f5e9 60%, #fffde7 100%)',
      py: { xs: 2, md: 6 },
      px: { xs: 1, md: 0 },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={7}>
            <Fade in timeout={800}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', letterSpacing: 2, color: 'success.main', fontSize: { xs: 40, md: 60 } }}>
                  EcoHack
                </Typography>
                <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary', fontWeight: 500 }}>
                  Estadísticas Globales
                </Typography>
                {/* Cuadros de estadísticas */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  {stats.map((stat, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.label}>
                      <Box sx={{
                        background: stat.color,
                        borderRadius: 6,
                        boxShadow: '0 4px 24px rgba(67,233,123,0.12)',
                        p: 3,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minHeight: 140,
                        color: '#fff',
                        mb: { xs: 2, md: 0 },
                        position: 'relative',
                      }}>
                        <Box sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.18)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1.5,
                        }}>
                          <img src={stat.icon} alt={stat.label} style={{ width: 28, height: 28 }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', mb: 1, fontSize: { xs: 28, md: 32 } }}>{stat.value}</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', fontSize: { xs: 16, md: 18 } }}>{stat.label}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Grid>
          <Grid item xs={12} md={5}>
            <Fade in timeout={1200}>
              <Card sx={{
                p: { xs: 2, md: 4 },
                boxShadow: 6,
                borderRadius: 6,
                background: 'linear-gradient(135deg, #e0f7fa 60%, #fffde7 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: { xs: 220, md: 340 },
                justifyContent: 'center',
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
                <CardContent sx={{ width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                  {/* Swiper de bienvenida y motivación con diseño atractivo */}
                  <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    loop={true}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 1800, disableOnInteraction: false }}
                    style={{ width: '100%', minHeight: 240 }}
                  >
                    {slides.map((slide, idx) => (
                      <SwiperSlide key={idx}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
                          <Box sx={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #fffde7 60%, #a5d6a7 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(165,214,167,0.18)',
                            mb: 2,
                          }}>
                            <img src={slide.img} alt={slide.title} style={{ width: 60, height: 60 }} />
                          </Box>
                          <Typography variant="h5" sx={{ fontSize: { xs: 22, md: 28 }, color: '#388e3c', fontWeight: 800, mb: 1, letterSpacing: 1 }}>
                            {slide.title}
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: { xs: 16, md: 20 }, color: '#388e3c', fontWeight: 500, mb: 1 }}>
                            {slide.desc}
                          </Typography>
                        </Box>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
