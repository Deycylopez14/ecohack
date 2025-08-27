import React from 'react';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import { Typography, Box } from '@mui/material';

export default function Logo() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <EmojiNatureIcon fontSize="large" color="inherit" />
      <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
        EcoHack
      </Typography>
    </Box>
  );
}
