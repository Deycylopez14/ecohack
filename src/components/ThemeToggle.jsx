import React from 'react';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit" aria-label="Alternar modo nocturno">
      {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
