import React, { useState } from 'react';
import { AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemText, Box, useScrollTrigger, Slide } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'INICIO', to: '/' },
  { label: 'EDUCACIÓN', to: '/educacion' },
  { label: 'MINIJUEGOS', to: '/minijuegos' },
  { label: 'MAPA', to: '/mapa' },
  { label: 'COMUNIDAD', to: '/comunidad' },
  { label: 'PERFIL', to: '/perfil' },
];

function HideOnScroll(props) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {props.children}
    </Slide>
  );
}

export default function NavBar(props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <HideOnScroll {...props}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ background: 'white', boxShadow: 3 }}>
          <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Logo />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              {navItems.map(item => (
                <Button key={item.to} color="inherit" component={Link} to={item.to} sx={{ fontWeight: 'bold', letterSpacing: 1, color: 'success.main', fontSize: 16 }}>
                  {item.label}
                </Button>
              ))}
            </Box>
            <IconButton
              color="success"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar />
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
    </HideOnScroll>
  );
}
