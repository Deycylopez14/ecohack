import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';

export default function SimuladorImpacto({ session, requireAuth }) {
  const [botellas, setBotellas] = React.useState(0);
  const impacto = (botellas * 0.185).toFixed(2); // kg CO2 ahorrados

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <EmojiNatureIcon color="secondary" />
        <Typography variant="h6" gutterBottom>Simulador de impacto ambiental</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 2, boxShadow: 2, borderRadius: 3 }}>
            <Typography>¿Cuántas botellas reciclaste este mes?</Typography>
            <input type="number" min={0} value={botellas} onChange={e => setBotellas(Number(e.target.value))} style={{ fontSize: 18, width: 80, margin: '8px 0', borderRadius: 6, border: '1px solid #ccc', padding: '4px 8px' }} />
            <Typography sx={{ mt: 2 }}>Has ahorrado <b>{impacto} kg</b> de CO₂.</Typography>
          </Paper>
        </Grid>
      </Grid>
      {!session && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          <span style={{ color: '#388e3c', cursor: 'pointer' }} onClick={() => requireAuth('Accede al simulador premium y guarda tu impacto registrándote gratis.')}>Regístrate para guardar tu impacto y acceder a contenido premium</span>
        </Typography>
      )}
    </Box>
  );
}
