import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { styles } from './styles/Search.styles';
import { useDataSync } from "./DataSyncContext";
import { SearchResults } from "./SearchResults";

// Definir el tipo de datos que vienen de la API
export interface Evento {
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Use the DataSyncContext to access stored events
  const { events, isLoading: isSyncLoading } = useDataSync();
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  
  // Combined loading state
  const isLoading = isSyncLoading || isLocalLoading;

  // Cargar preferencia de tema
  useEffect(() => {
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
      
      <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
          placeholder="Buscar"
          placeholderTextColor={isDarkMode ? "#FFFFFF" : "#7f8c8d"}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      
      <SearchResults 
        isLoading={isLoading}
        searchText={searchText}
        filteredEventos={filteredEventos}
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

export default Search;