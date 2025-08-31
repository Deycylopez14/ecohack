
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const icons = [
  <img src="https://cdn-icons-png.flaticon.com/512/1048/1048949.png" alt="Botella" style={{ width: 54, marginBottom: 8 }} />, // Botellas
  <img src="https://cdn-icons-png.flaticon.com/512/616/616494.png" alt="Impacto" style={{ width: 54, marginBottom: 8 }} />, // Impacto
  <img src="https://cdn-icons-png.flaticon.com/512/3523/3523063.png" alt="Retos" style={{ width: 54, marginBottom: 8 }} />, // Retos
  <img src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" alt="Logros" style={{ width: 54, marginBottom: 8 }} />, // Logros
];

export default function Dashboard() {
  // Datos simulados, luego se conectarán a Supabase
  const stats = [
    {
      icon: icons[0],
      title: 'Botellas recicladas',
      value: <span style={{ color: '#388E3C', fontWeight: 800 }}>{12450}</span>,
      bg: 'rgba(245,245,220,0.85)'
    },
    {
      icon: icons[1],
      title: 'Impacto ambiental',
      value: <span style={{ color: '#FBC02D', fontWeight: 800 }}>2.3 toneladas</span>,
      bg: 'rgba(179,229,252,0.85)'
    },
    {
      icon: icons[2],
      title: 'Retos activos',
      value: <span style={{ color: '#388E3C', fontWeight: 800 }}>{3}</span>,
      bg: 'rgba(102,187,106,0.15)'
    },
    {
      icon: icons[3],
      title: 'Logros destacados',
      value: (
        <Box>
          <Typography variant="body1" sx={{ fontSize: 18, mt: 0.5, color: '#1B5E20', fontWeight: 600, textAlign: 'center' }}>🎖️ Embajador del Reciclaje</Typography>
          <Typography variant="body1" sx={{ fontSize: 18, mt: 0.5, color: '#1B5E20', fontWeight: 600, textAlign: 'center' }}>🎖️ Explorador Verde</Typography>
        </Box>
      ),
      bg: 'rgba(245,245,220,0.85)'
    }
  ];

  return (
    <Box sx={{ mb: 2, maxWidth: 480, mx: 'auto' }}>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        spaceBetween={24}
        slidesPerView={1}
        style={{ paddingBottom: 32 }}
      >
        {stats.map((card, idx) => (
          <SwiperSlide key={idx}>
            <Card sx={{
              boxShadow: '0 8px 32px 0 rgba(56,142,60,0.18)',
              borderRadius: 6,
              p: 3,
              backdropFilter: 'blur(8px)',
              background: card.bg,
              minHeight: 240,
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
            }}>
              <CardContent sx={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 180 }}>
                {card.icon}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#388E3C', letterSpacing: 1, textAlign: 'center' }}>{card.title}</Typography>
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 0, textAlign: 'center' }}>{card.value}</Typography>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
