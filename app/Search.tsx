import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { styles } from './styles/Search.styles';
import { useDataSync } from "./DataSyncContext";
import { SearchResults } from "./SearchResults";
import { FilterChip } from "./FilterChip";

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
  const [originalFilteredEvents, setOriginalFilteredEvents] = useState<Evento[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Use the DataSyncContext to access stored events
  const { events, isLoading: isSyncLoading } = useDataSync();
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  
  // Filter state
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortMethod, setSortMethod] = useState<'none' | 'alphabetical' | 'chronological'>('none');
  
  // Filter options
  const [campusOptions, setCampusOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  
  // Combined loading state
  const isLoading = isSyncLoading || isLocalLoading;

  // Cargar preferencia de tema
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Extract unique filter options
  useEffect(() => {
    if (events.length > 0) {
      // Extract unique campus and types
      const campuses = [...new Set(events.map(event => event.Campus))];
      const types = [...new Set(events.map(event => event.Tipo))];
      
      setCampusOptions(campuses);
      setTypeOptions(types);
    }
  }, [events]);

  // Filter by text search
  useEffect(() => {
    if (events.length > 0) {
      if (searchText === "") {
        setOriginalFilteredEvents(events);
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
        
        setOriginalFilteredEvents(results);
      }
      setIsLocalLoading(false);
    }
  }, [searchText, events]);
  
  // Apply filters and sorting
  useEffect(() => {
    let results = [...originalFilteredEvents];
    
    // Apply campus filter
    if (selectedCampus) {
      results = results.filter(event => event.Campus === selectedCampus);
    }
    
    // Apply type filter
    if (selectedType) {
      results = results.filter(event => event.Tipo === selectedType);
    }
    
    // Apply sorting
    if (sortMethod === 'alphabetical') {
      results = results.sort((a, b) => a.Evento.localeCompare(b.Evento));
    } else if (sortMethod === 'chronological') {
      results = results.sort((a, b) => {
        const dateTimeA = `${a.Fecha}T${a.Inicio}`;
        const dateTimeB = `${b.Fecha}T${b.Inicio}`;
        return dateTimeA.localeCompare(dateTimeB);
      });
    }
    
    setFilteredEventos(results);
  }, [originalFilteredEvents, selectedCampus, selectedType, sortMethod]);
  
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
      
      {/* Filter chips section */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScrollView}
        contentContainerStyle={styles.filtersContainer}
      >
        {/* Sort options */}
        <View style={styles.filterDropdownContainer}>
          <Text style={[styles.filterLabel, isDarkMode && styles.darkText]}>Ordenar por:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScrollView}>
            <FilterChip 
              label="A-Z" 
              isSelected={sortMethod === 'alphabetical'} 
              onPress={() => setSortMethod(sortMethod === 'alphabetical' ? 'none' : 'alphabetical')}
              isDarkMode={isDarkMode}
            />
            <FilterChip 
              label="Cronológico" 
              isSelected={sortMethod === 'chronological'} 
              onPress={() => setSortMethod(sortMethod === 'chronological' ? 'none' : 'chronological')}
              isDarkMode={isDarkMode}
            />
          </ScrollView>
        </View>
        {/* Dropdown or selector for event types */}
        <View style={styles.filterDropdownContainer}>
          <Text style={[styles.filterLabel, isDarkMode && styles.darkText]}>Tipo:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScrollView}>
            <FilterChip 
              label="Todos" 
              isSelected={selectedType === null} 
              onPress={() => setSelectedType(null)}
              isDarkMode={isDarkMode}
            />
            {typeOptions.map(type => (
              <FilterChip 
                key={type}
                label={type} 
                isSelected={selectedType === type} 
                onPress={() => setSelectedType(selectedType === type ? null : type)}
                isDarkMode={isDarkMode}
              />
            ))}
          </ScrollView>
        </View>        
        
        {/* Dropdown or selector for campus */}
        <View style={styles.filterDropdownContainer}>
          <Text style={[styles.filterLabel, isDarkMode && styles.darkText]}>Campus:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScrollView}>
            <FilterChip 
              label="Todos" 
              isSelected={selectedCampus === null} 
              onPress={() => setSelectedCampus(null)}
              isDarkMode={isDarkMode}
            />
            {campusOptions.map(campus => (
              <FilterChip 
                key={campus}
                label={campus} 
                isSelected={selectedCampus === campus} 
                onPress={() => setSelectedCampus(selectedCampus === campus ? null : campus)}
                isDarkMode={isDarkMode}
              />
            ))}
          </ScrollView>
        </View>
        

      </ScrollView>
      
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