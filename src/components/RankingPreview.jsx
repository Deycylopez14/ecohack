import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const ranking = [
  { posicion: 1, nombre: 'Usuario1', puntos: 120 },
  { posicion: 2, nombre: 'Usuario2', puntos: 110 },
  { posicion: 3, nombre: 'Usuario3', puntos: 100 },
  { posicion: 4, nombre: null, puntos: 90 },
  { posicion: 5, nombre: null, puntos: 80 },
];

export default function RankingPreview({ session, requireAuth }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <LeaderboardIcon color="primary" />
        <Typography variant="h5">Ranking comunitario</Typography>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Posición</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Puntos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ranking.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{r.posicion}</TableCell>
                <TableCell>{session && r.nombre ? r.nombre : `#${r.posicion}`}</TableCell>
                <TableCell>{r.puntos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!session && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          <span style={{ color: '#388e3c', cursor: 'pointer' }} onClick={() => requireAuth('Accede al ranking completo y comparte tus logros ecológicos.')}>Regístrate para ver nombres y compartir logros</span>
        </Typography>
      )}
    </Box>
  );
}
