import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [colorBlindMode, setColorBlindMode] = useState(() => {
    return localStorage.getItem('colorBlindMode') || 'none';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.style.backgroundColor = '#0a0a1a';
      document.body.style.color = '#ffffff';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#1f2937';
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('colorBlindMode', colorBlindMode);
    document.body.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (colorBlindMode !== 'none') {
      document.body.classList.add(colorBlindMode);
    }
  }, [colorBlindMode]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    colorBlindMode,
    setColorBlindMode,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};