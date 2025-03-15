import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { styles } from './styles/User.styles'

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

const Welcome = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filteredEventos, setFilteredEventos] = useState<Evento[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedEventos, setSelectedEventos] = useState<Evento[]>([]);
  const navigation = useNavigation();

  // Cargar eventos desde la API
  useEffect(() => {
    fetch("https://7uk8il9o.vercel.app/eventos")
      .then(response => response.json())
      .then((data: Evento[]) => {
        setEventos(data);
        setFilteredEventos(data);
      })
      .catch(error => console.error("Error al obtener eventos:", error));
      
    // Cargar eventos seleccionados desde AsyncStorage
    loadSelectedEventos();
  }, []);

  // Filtrar eventos en tiempo real mientras el usuario escribe
  useEffect(() => {
    if (searchText === "") {
      setFilteredEventos(eventos);
    } else {
      const filtered = eventos.filter(evento => 
        evento.Evento.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredEventos(filtered);
    }
  }, [searchText, eventos]);

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

  // Guardar eventos seleccionados en AsyncStorage
  const saveSelectedEventos = async (updatedSelectedEventos: Evento[]) => {
    try {
      const jsonValue = JSON.stringify(updatedSelectedEventos);
      await AsyncStorage.setItem("selectedEventos", jsonValue);
    } catch (error) {
      console.error("Error al guardar eventos seleccionados:", error);
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
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>Busca y selecciona eventos de tu interés</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar eventos..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      
      <FlatList
        data={filteredEventos}
        keyExtractor={(item) => item._id}
        style={styles.eventList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.eventItem,
              isEventoSelected(item) && styles.selectedEventItem
            ]}
            onPress={() => toggleEventoSelection(item)}
          >
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{item.Evento}</Text>
              <Text style={styles.eventDetails}>
                {item.Fecha} • {item.Inicio} - {item.Fin}
              </Text>
              <Text style={styles.eventLocation}>
                {item.Sala}, {item.Edificio}, {item.Campus}
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
      
      <View style={styles.footer}>
        <Text style={styles.selectedCount}>
          {selectedEventos.length} eventos seleccionados
        </Text>
        <TouchableOpacity
          style={styles.configButton}
          onPress={() => navigation.navigate("Config" as never)}
        >
          <Text style={styles.configButtonText}>Ver seleccionados</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Welcome;