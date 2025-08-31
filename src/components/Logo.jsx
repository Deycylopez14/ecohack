import React from 'react';
import { Typography, Box } from '@mui/material';

export default function Logo() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-start', width: '100%' }}>
      <img src="/logo.png" alt="EcoHack Logo" style={{ width: 40, height: 40, marginRight: 8 }} />
      <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 2, color: 'success.main' }}>
        EcoHack
      </Typography>
    </Box>
  );
}
