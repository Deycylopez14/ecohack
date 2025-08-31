import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';

const comunidad = [
  {
    usuario: 'EcoLíder',
    logro: '100kg reciclados',
    avatar: '/assets/avatars/eco1.png'
  },
  {
    usuario: 'EcoAmigo',
    logro: '50kg reciclados',
    avatar: '/assets/avatars/eco2.png'
  }
];

export default function ComunidadContent() {
  return (
    <Box sx={{ mt: 2, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'secondary.main', textAlign: 'center' }} gutterBottom>
        <GroupIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Comunidad ecológica
      </Typography>
      <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ width: '100%' }}>
        {comunidad.map((c, i) => (
          <Grid item xs={12} md={6} key={i} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, textAlign: 'center', ':hover': { boxShadow: 6 }, mx: 'auto', width: '100%', maxWidth: 350, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CardContent sx={{ width: '100%' }}>
                <Avatar src={c.avatar} sx={{ mx: 'auto', mb: 1, width: 56, height: 56 }} />
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{c.usuario}</Typography>
                <Typography variant="body2" sx={{ color: 'success.main', textAlign: 'center' }}>{c.logro}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
