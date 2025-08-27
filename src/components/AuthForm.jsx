import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Button, TextField, Typography, Box } from '@mui/material';

export default function AuthForm({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let result;
    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }
    if (result.error) setError(result.error.message);
    else onAuth(result.data.session);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</Typography>
      <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" required />
      <TextField label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" required />
      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>{isLogin ? 'Entrar' : 'Crear cuenta'}</Button>
      <Button onClick={() => setIsLogin(!isLogin)} color="secondary" fullWidth sx={{ mt: 1 }}>
        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </Button>
    </Box>
  );
}
