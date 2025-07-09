import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from '../styles/themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [colors, setColors] = useState(themes.default.colors);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('selectedTheme');
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
        setColors(themes[savedTheme].colors);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const changeTheme = async (themeKey) => {
    try {
      await AsyncStorage.setItem('selectedTheme', themeKey);
      setCurrentTheme(themeKey);
      setColors(themes[themeKey].colors);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      colors,
      changeTheme,
      availableThemes: themes
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
