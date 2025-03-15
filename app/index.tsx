import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./styles/Index.styles";

const Main = () => {
  const [selectedEventos, setSelectedEventos] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation();

  // Cargar datos guardados
  useEffect(() => {
    loadSelectedEventos();
    loadThemePreference();
  }, []);

  // Cargar eventos seleccionados desde AsyncStorage
  const loadSelectedEventos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("selectedEventos");
      if (jsonValue !== null) {
        setSelectedEventos(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error("Error al cargar eventos seleccionados:", error);
    }
  };

  // Cargar preferencia de tema desde AsyncStorage
  const loadThemePreference = async () => {
    try {
      const value = await AsyncStorage.getItem("isDarkMode");
      if (value !== null) {
        setIsDarkMode(value === "true");
      }
    } catch (error) {
      console.error("Error al cargar preferencia de tema:", error);
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Botón de usuario en la esquina superior izquierda */}
      <TouchableOpacity
        style={styles.userIconButton}
        onPress={() => navigation.navigate("Welcome" as never)}
      >
        <Icon name="person-circle-outline" size={30} color={isDarkMode ? "#fff" : "#000"} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Panel Principal</Text>
        <Text style={[styles.subtitle, isDarkMode && styles.darkSubTitle]}>
          Gestiona tus eventos universitarios
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, isDarkMode && styles.darkStatCard]}>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>
            {selectedEventos.length}
          </Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>
            Eventos seleccionados
          </Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.mainButton, isDarkMode && styles.darkMainButton]}
          onPress={() => navigation.navigate("Config" as never)}
        >
          <Text style={styles.mainButtonText}>Configuración</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainButton, isDarkMode && styles.darkMainButton]}
          onPress={() => navigation.navigate("Search" as never)}
        >
          <Text style={styles.mainButtonText}>Buscar Eventos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainButton, isDarkMode && styles.darkMainButton]}
          onPress={() => navigation.navigate("Welcome" as never)}
        >
          <Text style={styles.mainButtonText}>Explorar Todos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, isDarkMode && styles.darkSubText]}>
          Desarrollado con ❤️ para la Universidad
        </Text>
      </View>
    </View>
  );
};

export default Main;
