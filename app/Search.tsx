import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { styles } from './styles/Search.styles'

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

const Search = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filteredEventos, setFilteredEventos] = useState<Evento[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedEventos, setSelectedEventos] = useState<Evento[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation();

  // Cargar eventos desde la API, eventos seleccionados y preferencia de tema
  useEffect(() => {
    fetchEventos();
    loadSelectedEventos();
    loadThemePreference();
  }, []);

  // Función para cargar eventos desde la API
  const fetchEventos = () => {
    fetch("https://7uk8il9o.vercel.app/eventos")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Evento[]) => {
        setEventos(data);
        // Mostrar todos los eventos al cargar la página
        setFilteredEventos(data);
      })
      .catch(error => {
        console.error("Error al obtener eventos:", error);
        Alert.alert("Error", "No se pudieron cargar los eventos. Intente nuevamente.");
      });
  };

  // Cargar eventos seleccionados desde AsyncStorage
  const loadSelectedEventos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("selectedEventos");
      if (jsonValue !== null) {
        setSelectedEventos(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error("Error al cargar eventos seleccionados:", error);
      Alert.alert("Error", "No se pudieron cargar tus eventos seleccionados.");
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
      Alert.alert("Error", "No se pudieron guardar tus selecciones.");
    }
  };

  // Añadir useEffect para filtrar en tiempo real como en Welcome
  useEffect(() => {
    if (searchText === "") {
      setFilteredEventos(eventos);
    } else {
      const searchTerm = searchText.toLowerCase();
      const results = eventos.filter(evento => 
        evento.Evento.toLowerCase().includes(searchTerm) ||
        evento.Tipo.toLowerCase().includes(searchTerm) ||
        evento.Fecha.toLowerCase().includes(searchTerm) ||
        evento.Inicio.toLowerCase().includes(searchTerm) ||
        evento.Fin.toLowerCase().includes(searchTerm) ||
        evento.Sala.toLowerCase().includes(searchTerm) ||
        evento.Edificio.toLowerCase().includes(searchTerm) ||
        evento.Campus.toLowerCase().includes(searchTerm)
      );
      
      setFilteredEventos(results);
    }
  }, [searchText, eventos]);

  // Ya no necesitamos estas funciones al eliminar la selección de eventos
  // Las mantenemos comentadas por si se necesitan en el futuro
  /*
  const toggleEventoSelection = (evento: Evento) => {
    const isSelected = selectedEventos.some(e => e._id === evento._id);
    
    let updatedSelectedEventos: Evento[];
    
    if (isSelected) {
      updatedSelectedEventos = selectedEventos.filter(e => e._id !== evento._id);
      Alert.alert("Evento eliminado", `"${evento.Evento}" ha sido eliminado de tus selecciones.`);
    } else {
      updatedSelectedEventos = [...selectedEventos, evento];
      Alert.alert("Evento seleccionado", `"${evento.Evento}" ha sido agregado a tus selecciones.`);
    }
    
    setSelectedEventos(updatedSelectedEventos);
    saveSelectedEventos(updatedSelectedEventos);
  };

  const isEventoSelected = (evento: Evento) => {
    return selectedEventos.some(e => e._id === evento._id);
  };
  */

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
          placeholder="Buscar"
          placeholderTextColor={isDarkMode ? "#95a5a6" : "#7f8c8d"}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      
      {searchText.trim() !== "" && filteredEventos.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={[styles.noResultsText, isDarkMode && styles.darkText]}>
            No se encontraron resultados para "{searchText}".
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEventos}
          keyExtractor={(item) => item._id}
          style={styles.eventList}
          ListEmptyComponent={
            filteredEventos.length === 0 ? (
              <Text style={[styles.instructionText, isDarkMode && styles.darkText]}>
                No se encontraron eventos que coincidan con la búsqueda.
              </Text>
            ) : null
          }
          ListHeaderComponent={
            filteredEventos.length > 0 ? (
              <Text style={[styles.resultsCount, isDarkMode && styles.darkText]}>
                {filteredEventos.length} resultado{filteredEventos.length !== 1 ? "s" : ""} encontrado{filteredEventos.length !== 1 ? "s" : ""}
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.eventItem,
                isDarkMode && styles.darkEventItem
              ]}
            >
              <View style={styles.eventContent}>
                <Text style={[styles.eventTitle, isDarkMode && styles.darkText]}>
                  {item.Evento}
                </Text>
                <Text style={[styles.eventDetails, isDarkMode && styles.darkText]}>
                  {item.Fecha} • {item.Inicio} - {item.Fin}
                </Text>
                <Text style={[styles.eventLocation, isDarkMode && styles.darkText]}>
                  {item.Sala}, {item.Edificio}, {item.Campus}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Search;