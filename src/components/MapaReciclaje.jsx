import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Grid, Card, CardContent } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const puntos = [
  { nombre: 'Punto Verde Central', tipo: 'Plástico', direccion: 'Av. Principal 123', horario: '8-18h', telefono: '555-1234' },
  { nombre: 'EcoPunto Norte', tipo: 'Vidrio', direccion: 'Calle Norte 45', horario: '9-17h', telefono: '555-5678' },
  { nombre: 'ReciclaTec', tipo: 'Electrónicos', direccion: 'Av. Tecnología 99', horario: '10-16h', telefono: '555-8765' },
];

const tipos = ['Todos', 'Plástico', 'Vidrio', 'Electrónicos'];

export default function MapaReciclaje({ session, requireAuth }) {
  const [filtro, setFiltro] = useState('Todos');
  const puntosFiltrados = filtro === 'Todos' ? puntos : puntos.filter(p => p.tipo === filtro);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>Mapa de Puntos de Reciclaje</Typography>
      <FormControl sx={{ mb: 2, minWidth: 180 }}>
        <InputLabel>Filtrar por material</InputLabel>
        <Select value={filtro} label="Filtrar por material" onChange={e => setFiltro(e.target.value)}>
          {tipos.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Select>
      </FormControl>
      <Box sx={{ mb: 2 }}>
        <iframe
          title="Mapa reciclaje"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2799144053!2d-74.2598756874436!3d40.69767006327437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQyJzU5LjYiTiA3NMKwMTUnNTIuMCJX!5e0!3m2!1ses!2smx!4v1693077600000!5m2!1ses!2smx"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: 8 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </Box>
      <Grid container spacing={2}>
        {puntosFiltrados.map((p, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Card sx={{ boxShadow: 2, borderRadius: 3, mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon color="primary" />
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>{p.nombre}</Typography>
                </Box>
                <Typography>Material: <b>{p.tipo}</b></Typography>
                <Typography>Dirección: {p.direccion}</Typography>
                <Typography>Horario: {p.horario}</Typography>
                <Typography>Teléfono: {p.telefono}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <span style={{ color: '#888' }}>Comentarios y verificación requieren registro.</span>
                  <br />
                  <span style={{ color: '#388e3c', cursor: 'pointer' }} onClick={() => requireAuth('Comenta y verifica puntos de reciclaje, guarda tus favoritos y gana recompensas ecológicas.')}>Regístrate para participar</span>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
