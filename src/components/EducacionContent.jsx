import React from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const residuos = [
  {
    tipo: 'Orgánico',
    descripcion: 'Restos de comida, cáscaras, residuos vegetales.',
    infografia: '/assets/infografias/organico.png',
    video: 'https://www.youtube.com/embed/1QZQz7v1K6A',
    consejo: 'Composta tus residuos orgánicos para crear abono natural.'
  },
  {
    tipo: 'Inorgánico',
    descripcion: 'Plásticos, metales, vidrio, cartón.',
    infografia: '/assets/infografias/inorganico.png',
    video: 'https://www.youtube.com/embed/2QZQz7v1K6B',
    consejo: 'Limpia y separa los envases antes de reciclar.'
  },
  {
    tipo: 'Reciclable',
    descripcion: 'Materiales que pueden reutilizarse o transformarse.',
    infografia: '/assets/infografias/reciclable.png',
    video: 'https://www.youtube.com/embed/3QZQz7v1K6C',
    consejo: 'Reutiliza botellas y bolsas siempre que puedas.'
  },
  {
    tipo: 'Peligroso',
    descripcion: 'Baterías, aceites, electrónicos, medicamentos.',
    infografia: '/assets/infografias/peligroso.png',
    video: 'https://www.youtube.com/embed/4QZQz7v1K6D',
    consejo: 'Lleva estos residuos a puntos de recolección especializados.'
  }
];

export default function EducacionContent() {
  return (
    <Box sx={{ mt: 2, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main', textAlign: 'center' }}>Tipos de residuos y cómo separarlos</Typography>
      <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ width: '100%' }}>
        {residuos.map((r, i) => (
          <Grid item xs={12} md={6} key={i} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6 }, textAlign: 'center', mx: 'auto', width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CardContent sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', width: '100%' }}>
                  <InfoIcon color="primary" />
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{r.tipo}</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, textAlign: 'center' }}>{r.descripcion}</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'secondary.main', textAlign: 'center' }}>Consejo: {r.consejo}</Typography>
              </CardContent>
              <CardMedia
                component="img"
                height="140"
                image={r.infografia}
                alt={`Infografía ${r.tipo}`}
                sx={{ objectFit: 'contain', background: '#f5f5f5', mx: 'auto', width: '80%' }}
              />
              <Box sx={{ p: 2, width: '100%' }}>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>Video:</Typography>
                <iframe width="100%" height="180" src={r.video} title={`Video ${r.tipo}`} frameBorder="0" allowFullScreen style={{ borderRadius: 8, display: 'block', margin: '0 auto' }}></iframe>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
