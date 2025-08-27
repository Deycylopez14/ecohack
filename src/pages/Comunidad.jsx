import React from 'react';
import { Container, Typography } from '@mui/material';
import RetosPreview from '../components/RetosPreview';
import RankingPreview from '../components/RankingPreview';

export default function Comunidad({ session, requireAuth }) {
  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Comunidad y Gamificación
      </Typography>
      <RetosPreview session={session} requireAuth={requireAuth} />
      <RankingPreview session={session} requireAuth={requireAuth} />
    </Container>
  );
}
