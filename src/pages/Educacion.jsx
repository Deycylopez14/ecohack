import React from 'react';
import { Container, Typography } from '@mui/material';
import EducacionContent from '../components/EducacionContent';

export default function Educacion() {
  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Módulo Educativo
      </Typography>
      <EducacionContent />
    </Container>
  );
}
