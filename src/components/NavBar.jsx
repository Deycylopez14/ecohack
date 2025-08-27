import React, { useState } from 'react';
import { AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const navItems = [
  { label: 'INICIO', to: '/' },
  { label: 'EDUCACIÓN', to: '/educacion' },
  { label: 'MINIJUEGOS', to: '/minijuegos' },
  { label: 'MAPA', to: '/mapa' },
  { label: 'COMUNIDAD', to: '/comunidad' },
  { label: 'PERFIL', to: '/perfil' },
];

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ flexGrow: 1, mb: 3 }}>
      <AppBar position="static" sx={{ background: 'var(--primary-color)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Logo />
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map(item => (
              <Button key={item.to} color="inherit" component={Link} to={item.to} sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                {item.label}
              </Button>
            ))}
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <List>
          {navItems.map(item => (
            <ListItem button key={item.to} component={Link} to={item.to} onClick={handleDrawerToggle}>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
