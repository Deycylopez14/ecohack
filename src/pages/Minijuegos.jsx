import React from 'react';
import { Container, Typography } from '@mui/material';
import QuizClasificacion from '../components/QuizClasificacion';
import SimuladorImpacto from '../components/SimuladorImpacto';

export default function Minijuegos({ session, requireAuth }) {
  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Minijuegos
      </Typography>
      <QuizClasificacion session={session} requireAuth={requireAuth} />
      <SimuladorImpacto session={session} requireAuth={requireAuth} />
    </Container>
  );
}
