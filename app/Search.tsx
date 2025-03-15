import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
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
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga
  const navigation = useNavigation();

  // Cargar eventos desde la API, eventos seleccionados y preferencia de tema
  useEffect(() => {
    fetchEventos();
    loadSelectedEventos();
    loadThemePreference();
  }, []);

  // Función para cargar eventos desde la API
  const fetchEventos = () => {
    setIsLoading(true); // Indicar que está cargando
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
        setIsLoading(false); // Finalizar la carga cuando los datos estén disponibles
      })
      .catch(error => {
        console.error("Error al obtener eventos:", error);
        Alert.alert("Error", "No se pudieron cargar los eventos. Intente nuevamente.");
        setIsLoading(false); // Asegurarse de finalizar la carga incluso en caso de error
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
      
      {isLoading ? (
        // Mostrar spinner de carga mientras se obtienen los datos
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkMode ? "#FFFFFF" : "#000000"} />

        </View>
      ) : searchText.trim() !== "" && filteredEventos.length === 0 ? (
        // Mostrar mensaje de no resultados cuando hay una búsqueda sin coincidencias
        <View style={styles.noResultsContainer}>
          <Text style={[styles.noResultsText, isDarkMode && styles.darkText]}>
            No se encontraron resultados para "{searchText}".
          </Text>
        </View>
      ) : (
        // Mostrar la lista de eventos
        <FlatList
          data={filteredEventos}
          keyExtractor={(item) => item._id}
          style={styles.eventList}
          ListEmptyComponent={
            !isLoading && filteredEventos.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Text style={[styles.instructionText, isDarkMode && styles.darkText]}>
                  No se encontraron eventos disponibles.
                </Text>
              </View>
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