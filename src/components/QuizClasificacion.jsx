import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import RecyclingIcon from '@mui/icons-material/Recycling';

const residuos = [
  { nombre: 'Cáscara de plátano', tipo: 'Orgánico' },
  { nombre: 'Botella de plástico', tipo: 'Reciclable' },
  { nombre: 'Pila', tipo: 'Peligroso' },
  { nombre: 'Lata de aluminio', tipo: 'Reciclable' },
];
const contenedores = ['Orgánico', 'Reciclable', 'Peligroso', 'Inorgánico'];

export default function QuizClasificacion({ session, requireAuth }) {
  const [respuestas, setRespuestas] = useState(Array(residuos.length).fill(''));
  const [resultado, setResultado] = useState(null);

  const handleSelect = (i, tipo) => {
    const nuevas = [...respuestas];
    nuevas[i] = tipo;
    setRespuestas(nuevas);
  };

  const verificar = () => {
    const aciertos = residuos.filter((r, i) => r.tipo === respuestas[i]).length;
    setResultado(`¡Obtuviste ${aciertos} de ${residuos.length} correctos!`);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <RecyclingIcon color="primary" />
        <Typography variant="h6" gutterBottom>Quiz de clasificación</Typography>
      </Box>
      <Grid container spacing={2}>
        {residuos.map((r, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Paper sx={{ p: 2, mb: 2, boxShadow: 2, borderRadius: 3 }}>
              <Typography sx={{ fontWeight: 'bold' }}>{r.nombre}</Typography>
              {contenedores.map(c => (
                <Button
                  key={c}
                  variant={respuestas[i] === c ? 'contained' : 'outlined'}
                  color="primary"
                  sx={{ m: 0.5 }}
                  onClick={() => handleSelect(i, c)}
                >
                  {c}
                </Button>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="success" onClick={verificar}>Verificar respuestas</Button>
      {resultado && <Typography sx={{ mt: 2 }}>{resultado}</Typography>}
      {!session && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          <span style={{ color: '#388e3c', cursor: 'pointer' }} onClick={() => requireAuth('Guarda tu progreso y accede a minijuegos premium registrándote gratis.')}>Regístrate para guardar tu progreso</span>
        </Typography>
      )}
    </Box>
  );
}
