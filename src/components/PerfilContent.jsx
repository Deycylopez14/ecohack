import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const perfil = {
  nombre: 'Deycy Mercedes',
  puntos: 1200,
  nivel: 'EcoAvanzado',
  avatar: '/assets/avatars/perfil.png'
};

export default function PerfilContent() {
  return (
    <Box sx={{ mt: 2, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }} gutterBottom>
        <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Mi perfil ecológico
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Card sx={{ maxWidth: 400, boxShadow: 3, borderRadius: 3, textAlign: 'center', ':hover': { boxShadow: 6 }, mx: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CardContent sx={{ width: '100%' }}>
            <Avatar src={perfil.avatar} sx={{ mx: 'auto', mb: 1, width: 72, height: 72 }} />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{perfil.nombre}</Typography>
            <Typography variant="body2" sx={{ color: 'success.main', textAlign: 'center' }}>Puntos: {perfil.puntos}</Typography>
            <Typography variant="body2" sx={{ color: 'warning.main', textAlign: 'center' }}>Nivel: {perfil.nivel}</Typography>
            <Button variant="contained" color="secondary" sx={{ mt: 2, mx: 'auto', display: 'block', textAlign: 'center' }}>Editar perfil</Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
