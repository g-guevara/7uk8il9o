import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { styles } from './styles/Search.styles';
import { useDataSync } from "./DataSyncContext";


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
  const [filteredEventos, setFilteredEventos] = useState<Evento[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedEventos, setSelectedEventos] = useState<Evento[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation();
  
  // Use the DataSyncContext to access stored events
  const { events, isLoading: isSyncLoading } = useDataSync();
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  
  // Combined loading state
  const isLoading = isSyncLoading || isLocalLoading;

  // Cargar eventos seleccionados y preferencia de tema
  useEffect(() => {
    loadSelectedEventos();
    loadThemePreference();
  }, []);

  // Set filtered events when search text or events change
  useEffect(() => {
    if (events.length > 0) {
      if (searchText === "") {
        setFilteredEventos(events);
      } else {
        const searchTerm = searchText.toLowerCase();
        const results = events.filter(evento => 
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
      setIsLocalLoading(false);
    }
  }, [searchText, events]);

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

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      
      <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
          placeholder="Buscar"
          placeholderTextColor={isDarkMode ? "#FFFFFF" : "#7f8c8d"}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkMode ? "#FFFFFF" : "#000000"} />
        </View>
      ) : searchText.trim() !== "" && filteredEventos.length === 0 ? (
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
                styles.cardEventItem,
                isDarkMode && styles.darkCardEventItem
              ]}
            >
              <View style={styles.eventHeader}>
                <Text style={[styles.eventTitle, isDarkMode && styles.darkText]}>
                  {item.Evento}
                </Text>
              </View>
              
              <View style={styles.eventTimeContainer}>
                <Text style={[styles.eventTime, isDarkMode && styles.darkEventTime]}>
                  {item.Tipo} en {item.Campus}, {item.Inicio.substring(0, 5)} - {item.Fin.substring(0, 5)}
                </Text>
              </View>
              
              <View style={[styles.roomNumberContainer, isDarkMode && styles.darkRoomNumberContainer]}>
                <Text style={[styles.roomNumber, isDarkMode && styles.darkRoomNumber]}>
                  {item.Sala} 
                </Text>
              </View>
            </View>
          )}
          numColumns={1}
        />
      )}
    </View>
  );
};

export default Search;