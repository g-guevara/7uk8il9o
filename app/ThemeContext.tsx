import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definir la interfaz para el contexto
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: (value: boolean) => void;
  isThemeLoaded: boolean;
}

// Crear el contexto con un valor predeterminado
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleTheme: () => {},
  isThemeLoaded: false
});

// Props para el ThemeProvider
interface ThemeProviderProps {
  children: React.ReactNode;
}

// Proveedor del contexto que mantiene el estado del tema
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isThemeLoaded, setIsThemeLoaded] = useState<boolean>(false);

  // Cargar la preferencia del tema cuando el componente se monta
  useEffect(() => {
    const loadTheme = async () => {
      try {
        console.log('Cargando preferencia de tema...');
        const value = await AsyncStorage.getItem("isDarkMode");
        console.log('Preferencia cargada:', value);
        
        if (value !== null) {
          setIsDarkMode(value === "true");
        } else {
          // Si no hay preferencia guardada, usar modo oscuro por defecto
          await AsyncStorage.setItem("isDarkMode", "true");
        }
      } catch (error) {
        console.error("Error al cargar preferencia de tema:", error);
      } finally {
        setIsThemeLoaded(true);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async (value: boolean) => {
    try {
      console.log('Cambiando tema a:', value ? 'oscuro' : 'claro');
      setIsDarkMode(value);
      await AsyncStorage.setItem("isDarkMode", value.toString());
    } catch (error) {
      console.error("Error al guardar preferencia de tema:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isThemeLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema
export const useTheme = () => useContext(ThemeContext);