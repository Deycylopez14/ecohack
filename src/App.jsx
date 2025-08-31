import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Educacion from './pages/Educacion';
import Minijuegos from './pages/Minijuegos';
import Mapa from './pages/Mapa';
import Comunidad from './pages/Comunidad';
import Perfil from './pages/Perfil';
import AuthForm from './components/AuthForm';
import LogoutButton from './components/LogoutButton';
import ThemeToggle from './components/ThemeToggle';
import PushNotification from './components/PushNotification';
import { CssBaseline, ThemeProvider, Container, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import theme from './styles/theme';
import { supabase } from './utils/supabaseClient';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

function App() {
  const [session, setSession] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authReason, setAuthReason] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => listener.subscription.unsubscribe();
  }, []);

  const muiTheme = { ...theme, palette: { ...theme.palette, mode: darkMode ? 'dark' : 'light' } };

  // Función para requerir registro en acciones avanzadas
  const requireAuth = (reason) => {
    setAuthReason(reason);
    setShowAuthDialog(true);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <Container sx={{ mt: 2 }}>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <PushNotification session={session} />
          <Box sx={{ mb: 2 }}>
            <NavBar />
          </Box>
          <Routes>
            <Route path="/" element={<Home session={session} />} />
            <Route path="/educacion" element={<Educacion />} />
            <Route path="/minijuegos" element={<Minijuegos session={session} requireAuth={requireAuth} />} />
            <Route path="/mapa" element={<Mapa session={session} requireAuth={requireAuth} />} />
            <Route path="/comunidad" element={<Comunidad session={session} requireAuth={requireAuth} />} />
            <Route path="/perfil" element={session ? <Perfil session={session} darkMode={darkMode} setDarkMode={setDarkMode} /> : <Box sx={{ mt: 4 }}><Typography>Debes registrarte para acceder a tu perfil.</Typography><Button variant="contained" color="primary" onClick={() => requireAuth('Accede a tu perfil y guarda tus logros')}>Registrarse</Button></Box>} />
          </Routes>
          {session && <LogoutButton onLogout={() => setSession(null)} />}
          <Dialog open={showAuthDialog} onClose={() => setShowAuthDialog(false)}>
            <DialogTitle>¡Regístrate gratis!</DialogTitle>
            <DialogContent>
              <Typography>{authReason}</Typography>
              <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Al registrarte podrás:</Typography>
              <ul>
                <li>Guardar tus logros y progreso</li>
                <li>Participar en retos y ranking</li>
                <li>Canjear puntos y acceder a contenido premium</li>
                <li>Insignia exclusiva: “Explorador Verde”</li>
              </ul>
              <AuthForm onAuth={session => { setSession(session); setShowAuthDialog(false); }} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowAuthDialog(false)}>Cerrar</Button>
            </DialogActions>
          </Dialog>
          <Footer />
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
