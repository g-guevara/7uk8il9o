import React, { useEffect, useState } from "react";
import { View, Text, Switch, TouchableOpacity, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { styles } from './styles/Config.styles'

// Definir el tipo de datos que vienen de la API
interface Evento {
  _id: string;
  Tipo: string;
  Evento: string;
  Fecha: string;
  Inicio: string;
  Fin: string;
  Sala: string;
  Edificio: string;
  Campus: string;
  fechaActualizacion: string;
}

const Config = () => {
  const [selectedEventos, setSelectedEventos] = useState<Evento[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation();

  // Cargar eventos seleccionados y configuración del tema
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

  // Guardar eventos seleccionados en AsyncStorage
  const saveSelectedEventos = async (updatedSelectedEventos: Evento[]) => {
    try {
      const jsonValue = JSON.stringify(updatedSelectedEventos);
      await AsyncStorage.setItem("selectedEventos", jsonValue);
    } catch (error) {
      console.error("Error al guardar eventos seleccionados:", error);
    }
  };

  // Guardar preferencia de tema en AsyncStorage
  const saveThemePreference = async (value: boolean) => {
    try {
      await AsyncStorage.setItem("isDarkMode", value.toString());
    } catch (error) {
      console.error("Error al guardar preferencia de tema:", error);
    }
  };

  // Eliminar un evento seleccionado
  const removeEvento = (evento: Evento) => {
    Alert.alert(
      "Eliminar evento",
      `¿Estás seguro de que deseas eliminar "${evento.Evento}" de tus selecciones?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => {
            const updatedSelectedEventos = selectedEventos.filter(
              e => e._id !== evento._id
            );
            setSelectedEventos(updatedSelectedEventos);
            saveSelectedEventos(updatedSelectedEventos);
          },
          style: "destructive"
        }
      ]
    );
  };

  // Manejar el cambio de tema
  const handleThemeToggle = (value: boolean) => {
    setIsDarkMode(value);
    saveThemePreference(value);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Configuración</Text>
      
      <View style={styles.themeSection}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Apariencia</Text>
        <View style={styles.themeToggleContainer}>
          <Text style={[styles.themeLabel, isDarkMode && styles.darkText]}>Modo oscuro</Text>
          <Switch
            value={isDarkMode}
            onValueChange={handleThemeToggle}
            trackColor={{ false: "#ddd", true: "#3498db" }}
            thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
          />
        </View>
      </View>
      
      <View style={styles.eventsSection}>
        <View style={styles.eventsSectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Mis eventos ({selectedEventos.length})
          </Text>
          <TouchableOpacity
            style={styles.searchMoreButton}
            onPress={() => navigation.navigate("Search" as never)}
          >
            <Text style={styles.searchMoreButtonText}>Buscar más</Text>
          </TouchableOpacity>
        </View>
        
        {selectedEventos.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={[styles.emptyStateText, isDarkMode && styles.darkText]}>
              No tienes eventos seleccionados.
            </Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => navigation.navigate("Welcome" as never)}
            >
              <Text style={styles.addFirstButtonText}>Agregar eventos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={selectedEventos}
            keyExtractor={(item) => item._id}
            style={styles.eventsList}
            renderItem={({ item }) => (
              <View style={[styles.eventItem, isDarkMode && styles.darkEventItem]}>
                <View style={styles.eventContent}>
                  <Text style={[styles.eventTitle, isDarkMode && styles.darkText]}>
                    {item.Evento}
                  </Text>
                  <Text style={[styles.eventDetails, isDarkMode && styles.darkSubText]}>
                    {item.Fecha} • {item.Inicio} - {item.Fin}
                  </Text>
                  <Text style={[styles.eventLocation, isDarkMode && styles.darkSubText]}>
                    {item.Sala}, {item.Campus}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeEvento(item)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, isDarkMode && styles.darkFooterButton]}
          onPress={() => navigation.navigate("Welcome" as never)}
        >
          <Text style={[styles.footerButtonText, isDarkMode && styles.darkFooterButtonText]}>
            Inicio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, isDarkMode && styles.darkFooterButton]}
          onPress={() => navigation.navigate("Search" as never)}
        >
          <Text style={[styles.footerButtonText, isDarkMode && styles.darkFooterButtonText]}>
            Buscar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Config;