import React from 'react';
import { supabase } from '../utils/supabaseClient';
import { Button } from '@mui/material';

export default function LogoutButton({ onLogout }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (onLogout) onLogout();
  };
  return <Button color="secondary" variant="outlined" onClick={handleLogout}>Cerrar sesión</Button>;
}
