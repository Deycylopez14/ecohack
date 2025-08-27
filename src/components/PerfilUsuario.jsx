import React from 'react';
import { Box, Typography, Card, CardContent, Switch, FormControlLabel } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';

export default function PerfilUsuario({ session, darkMode, setDarkMode }) {
  // Datos simulados, luego se conectarán a Supabase
  const logros = ['Explorador Verde', 'Embajador del Reciclaje'];
  const email = session?.user?.email || 'usuario@ecoblock.com';

  return (
    <Box>
      <Card sx={{ boxShadow: 2, borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <PersonIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Perfil de Usuario</Typography>
          </Box>
          <Typography variant="body1">Email: {email}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>Logros:</Typography>
          {logros.map((l, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmojiEventsIcon color="success" />
              <Typography variant="body2">{l}</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />}
        label="Modo nocturno"
      />
      <Typography variant="body2" sx={{ mt: 2 }}>
        Accesibilidad: Fuentes legibles, navegación por teclado y modo alto contraste.
      </Typography>
    </Box>
  );
}
