import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { styles } from './styles/User.styles';
import { useDataSync } from "./DataProvider/DataSyncContext";
import { FilterChip } from "./FilterChip";

// Función para obtener el día de la semana a partir de la fecha
const obtenerDiaSemana = (fechaStr: string): string => {
  try {
    const fecha = new Date(fechaStr);
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return diasSemana[fecha.getDay()];
  } catch (error) {
    console.error("Error al obtener día de la semana:", error);
    return ''; // En caso de error, devolver cadena vacía
  }
};

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
  diaSemana?: string; // Campo opcional, podría venir de la API
}

const User = () => {
  const [filteredEventos, setFilteredEventos] = useState<Evento[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedEventos, setSelectedEventos] = useState<Evento[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation();
  const [totalCount, setTotalCount] = useState(0);
  
  // Use the DataSyncContext to access stored all_eventos data
  const { allEvents, isLoading: isSyncLoading } = useDataSync();
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

  // Cargar eventos seleccionados y preferencia de tema
  useEffect(() => {
    loadSelectedEventos();
    loadThemePreference();
  }, []);
  
  // Extract unique filter options
  useEffect(() => {
    if (allEvents.length > 0) {
      // Extract unique campus and types
      const campuses = [...new Set(allEvents.map(event => event.Campus))];
      const types = [...new Set(allEvents.map(event => event.Tipo))];
      
      setCampusOptions(campuses);
      setTypeOptions(types);
    }
  }, [allEvents]);
  
  // Log cuando los eventos cambian para debugging
  useEffect(() => {
    if (allEvents.length > 0) {
      console.log(`DataSync proporcionó ${allEvents.length} all_eventos totales`);
      setTotalCount(allEvents.length);
    }
  }, [allEvents]);
  
  // Función para normalizar texto (eliminar tildes y convertir a minúsculas)
  const normalizeText = (text: string): string => {
    return text.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos/tildes
      .replace(/[^\w\s]/gi, ''); // Eliminar caracteres especiales
  };
  
  // Update filtered events when events or search text changes
  useEffect(() => {
    if (allEvents.length > 0) {
      setIsLocalLoading(true);
      try {
        // First apply text search filtering
        let results = [...allEvents];
        
        if (searchText.trim() !== "") {
          const searchTerms = normalizeText(searchText).split(' ').filter(term => term.length > 0);
          
          results = allEvents.filter(evento => {
            // Normaliza todos los campos de búsqueda
            const normalizedEvento = normalizeText(evento.Evento);
            const normalizedTipo = normalizeText(evento.Tipo);
            const normalizedFecha = normalizeText(evento.Fecha);
            const normalizedInicio = normalizeText(evento.Inicio);
            const normalizedFin = normalizeText(evento.Fin);
            const normalizedSala = normalizeText(evento.Sala);
            const normalizedEdificio = normalizeText(evento.Edificio);
            const normalizedCampus = normalizeText(evento.Campus);
            
            // Verifica que TODOS los términos de búsqueda estén presentes en al menos uno de los campos
            return searchTerms.every(term => 
              normalizedEvento.includes(term) ||
              normalizedTipo.includes(term) ||
              normalizedFecha.includes(term) ||
              normalizedInicio.includes(term) ||
              normalizedFin.includes(term) ||
              normalizedSala.includes(term) ||
              normalizedEdificio.includes(term) ||
              normalizedCampus.includes(term)
            );
          });
        }
        
        // Then apply filters
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
      } catch (error) {
        console.error("Error al filtrar eventos:", error);
        // En caso de error, mostrar todos los eventos
        setFilteredEventos(allEvents);
      } finally {
        setIsLocalLoading(false);
      }
    }
  }, [searchText, allEvents, selectedCampus, selectedType, sortMethod]);

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

  // Seleccionar o deseleccionar un evento
  const toggleEventoSelection = (evento: Evento) => {
    // Verificar si el evento ya está seleccionado
    const isSelected = selectedEventos.some(e => e._id === evento._id);
    
    let updatedSelectedEventos: Evento[];
    
    if (isSelected) {
      // Quitar de la selección
      updatedSelectedEventos = selectedEventos.filter(e => e._id !== evento._id);
    } else {
      // Agregar a la selección
      updatedSelectedEventos = [...selectedEventos, evento];
    }
    
    setSelectedEventos(updatedSelectedEventos);
    saveSelectedEventos(updatedSelectedEventos);
  };

  // Verificar si un evento está seleccionado
  const isEventoSelected = (evento: Evento) => {
    return selectedEventos.some(e => e._id === evento._id);
  };

  // Renderizar cada elemento de la lista de eventos
  const renderEventItem = ({ item }: { item: Evento }) => {
    // Asegurarse de que el día de la semana se muestre correctamente
    const diaSemana = item.diaSemana || obtenerDiaSemana(item.Fecha);
    
    return (
      <TouchableOpacity
        style={[
          styles.eventItem,
          isDarkMode && styles.darkEventItem,
          isEventoSelected(item) && (isDarkMode ? styles.darkSelectedEventItem : styles.selectedEventItem)
        ]}
        onPress={() => toggleEventoSelection(item)}
      >
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Text style={[styles.eventTitle, isDarkMode && styles.darkText]}>
              {item.Evento}
            </Text>
          </View>
          
          <Text style={[styles.eventDetails, isDarkMode && styles.darkEventDetails]}>
            {diaSemana}, {item.Campus}, {item.Inicio.substring(0, 5)} - {item.Fin.substring(0, 5)}
          </Text>
        </View>
        
        {isEventoSelected(item) && (
          <View style={[styles.selectionIndicator, isDarkMode && styles.darkSelectionIndicator]}>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Filter chips section
  const renderFilters = () => (
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
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
          placeholder="Buscar ramos 2025 - I"
          placeholderTextColor={isDarkMode ? "#FFFFFF" : "#7f8c8d"}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      
      {/* Add the filters section */}
      {!isLoading && renderFilters()}
      
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
          renderItem={renderEventItem}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
          removeClippedSubviews={true}
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
                {totalCount > 0 ? ` (de ${totalCount} totales)` : ''}
              </Text>
            ) : null
          }
        />
      )}
      
      <View style={[styles.footer, isDarkMode && styles.darkFooter]}>
        <Text style={[styles.selectedCount, isDarkMode && styles.darkSelectedCount]}>
          {selectedEventos.length} eventos seleccionados
        </Text>
      </View>
    </View>
  );
};

export default User;