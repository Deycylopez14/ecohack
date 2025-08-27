import React, { useEffect } from 'react';
import { Button } from '@mui/material';

export default function PushNotification({ session }) {
  useEffect(() => {
    if (session && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, [session]);

  const sendNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('¡Nuevo reto disponible!', {
        body: 'Recicla 5 botellas esta semana y gana puntos ecológicos.',
        icon: '/icon-192.png',
      });
    }
  };

  if (!session) return null;

  return (
    <Button variant="outlined" color="success" onClick={sendNotification} sx={{ mb: 2 }}>
      Probar notificación push
    </Button>
  );
}
