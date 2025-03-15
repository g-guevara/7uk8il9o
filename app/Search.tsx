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
    fetch("https://7uk8il9o.vercel.app/eventos")
      .then(response => response.json())
      .then((data: Evento[]) => {
        setEventos(data);
        // Inicialmente no mostramos resultados hasta que el usuario busque algo
        setFilteredEventos([]);
      })
      .catch(error => console.error("Error al obtener eventos:", error));
      
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

  // Función de búsqueda avanzada - busca en todos los campos
  const handleSearch = () => {
    if (searchText.trim() === "") {
      setFilteredEventos([]);
      return;
    }
    
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
  };

  // Seleccionar o deseleccionar un evento
  const toggleEventoSelection = (evento: Evento) => {
    // Verificar si el evento ya está seleccionado
    const isSelected = selectedEventos.some(e => e._id === evento._id);
    
    let updatedSelectedEventos: Evento[];
    
    if (isSelected) {
      // Quitar de la selección
      updatedSelectedEventos = selectedEventos.filter(e => e._id !== evento._id);
      Alert.alert("Evento eliminado", `"${evento.Evento}" ha sido eliminado de tus selecciones.`);
    } else {
      // Agregar a la selección
      updatedSelectedEventos = [...selectedEventos, evento];
      Alert.alert("Evento seleccionado", `"${evento.Evento}" ha sido agregado a tus selecciones.`);
    }
    
    setSelectedEventos(updatedSelectedEventos);
    saveSelectedEventos(updatedSelectedEventos);
  };

  // Verificar si un evento está seleccionado
  const isEventoSelected = (evento: Evento) => {
    return selectedEventos.some(e => e._id === evento._id);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Búsqueda Avanzada</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
          placeholder="Buscar por cualquier campo..."
          placeholderTextColor={isDarkMode ? "#95a5a6" : "#7f8c8d"}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
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
          ListHeaderComponent={
            filteredEventos.length > 0 ? (
              <Text style={[styles.resultsCount, isDarkMode && styles.darkText]}>
                {filteredEventos.length} resultado{filteredEventos.length !== 1 ? "s" : ""} encontrado{filteredEventos.length !== 1 ? "s" : ""}
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.eventItem,
                isDarkMode && styles.darkEventItem,
                isEventoSelected(item) && styles.selectedEventItem,
                isDarkMode && isEventoSelected(item) && styles.darkSelectedEventItem,
              ]}
              onPress={() => toggleEventoSelection(item)}
            >
              <View style={styles.eventContent}>
                <Text style={[styles.eventTitle, isDarkMode && styles.darkText]}>
                  {item.Evento}
                </Text>
              </View>
              
              <View style={styles.selectionIndicator}>
                {isEventoSelected(item) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      
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
          onPress={() => navigation.navigate("Config" as never)}
        >
          <Text style={[styles.footerButtonText, isDarkMode && styles.darkFooterButtonText]}>
            Configuración
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
