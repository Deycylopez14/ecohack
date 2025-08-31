import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ mt: 6, py: 3, background: '#e8f5e9', textAlign: 'center', borderTop: '1px solid #c8e6c9' }}>
      <Typography variant="body2" color="text.secondary">
        © 2025 EcoHack | Desarrollado por Deycy Mercedes & Monica Isabel
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Link href="https://github.com/Deycylopez14/ecohack" target="_blank" rel="noopener" sx={{ mx: 1 }}>
          GitHub
        </Link>
        <Link href="mailto:contacto@ecohack.com" sx={{ mx: 1 }}>
          Contacto
        </Link>
      </Box>
    </Box>
  );
}
