import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated, ScrollView, Alert } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles/Index.styles";

interface EventStatsProps {
  isDarkMode: boolean;
  navigation: NavigationProp<any>;
}

// Interface for the event data from AsyncStorage
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

// Interface for the card display format
interface EventCardData {
  id: string;
  titleFirstLine: string;
  titleSecondLine: string;
  startTime: string;
  endTime: string;
  startMinutes: string;
  endMinutes: string;
  room: string;
  color: string;
}

// Color palette for the cards
const CARD_COLORS = [
  "#2becc6", // Teal
  "#FFE135", // Yellow
  "#2bb5ec", // Light Blue
  "#B768A2", // Purple
  "#9ACD32", // Green
  "#FF6347", // Tomato
  "#4682B4", // Steel Blue
  "#FFA500"  // Orange
];

const EventStats: React.FC<EventStatsProps> = ({ isDarkMode, navigation }) => {
  const [selectedEvents, setSelectedEvents] = useState<Evento[]>([]);
  const [cardEvents, setCardEvents] = useState<EventCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Keep track of scroll position
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Load selected events from AsyncStorage
  useEffect(() => {
    const loadSelectedEvents = async () => {
      try {
        setIsLoading(true);
        const jsonValue = await AsyncStorage.getItem("selectedEventos");
        if (jsonValue !== null) {
          const events: Evento[] = JSON.parse(jsonValue);
          setSelectedEvents(events);
          
          // Transform the events to the card format
          const transformedEvents = transformEventsToCardFormat(events);
          setCardEvents(transformedEvents);
        }
      } catch (error) {
        console.error("Error loading selected events:", error);
        Alert.alert("Error", "No se pudieron cargar tus eventos seleccionados.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSelectedEvents();
  }, []);
  
  // Transform the event data to the format needed for the cards
  const transformEventsToCardFormat = (events: Evento[]): EventCardData[] => {
    return events.map((event, index) => {
      // Split the event title into two lines if it's long
      let titleFirstLine = event.Evento;
      let titleSecondLine = event.Tipo;
      
      if (event.Evento.length > 15) {
        const words = event.Evento.split(' ');
        const midpoint = Math.ceil(words.length / 2);
        titleFirstLine = words.slice(0, midpoint).join(' ');
        titleSecondLine = words.slice(midpoint).join(' ');
      }
      
      // Extract hours and minutes from start and end times
      const startTimeParts = event.Inicio.split(':');
      const endTimeParts = event.Fin.split(':');
      
      return {
        id: event._id,
        titleFirstLine: titleFirstLine,
        titleSecondLine: titleSecondLine,
        startTime: startTimeParts[0] || "00",
        endTime: endTimeParts[0] || "00",
        startMinutes: startTimeParts[1] || "00",
        endMinutes: endTimeParts[1] || "00",
        room: event.Sala,
        color: CARD_COLORS[index % CARD_COLORS.length] // Cycle through colors
      };
    });
  };
  
  // Show a message if no events are selected
  if (cardEvents.length === 0 && !isLoading) {
    return (
      <View style={styles.mainContentContainer}>
        <View style={{ height: 110 }} />
        <View style={styles.noEventsContainer}>
          <Text style={[styles.noEventsText, isDarkMode && styles.darkText]}>
            No tienes eventos seleccionados.
          </Text>
          <TouchableOpacity
            style={styles.addEventsButton}
            onPress={() => navigation.navigate("Config" as never)}
          >
            <Text style={styles.addEventsButtonText}>
              Agregar eventos
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.mainContentContainer}>
      {/* Add spacing at the top to prevent overlap with the date header */}
      <View style={{ height: 110 }} />
      
      {/* Event List with ScrollView */}
      <ScrollView
        style={styles.eventListContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventListContentContainer}
      >
        {cardEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={[
              styles.eventCard,
              { backgroundColor: event.color }
            ]}
            onPress={() => {
              // Navigate to details if needed
              console.log(`Pressed on event: ${event.titleFirstLine} ${event.titleSecondLine}`);
            }}
          >
            <View style={styles.eventCardContent}>
              {/* Left side with times */}
              <View style={styles.eventTimeColumn}>
                {/* Start time */}
                <Text style={styles.timeNumber}>{event.startTime}</Text>
                <Text style={styles.timeMinutes}>{event.startMinutes}</Text>
                
                {/* Vertical Divider line */}
                <View style={styles.timeVerticalDivider} />
                
                {/* End time */}
                <Text style={styles.timeNumber}>{event.endTime}</Text>
                <Text style={styles.timeMinutes}>{event.endMinutes}</Text>
              </View>
              
              {/* Right side with event details */}
              <View style={styles.eventDetailsColumn}>
                {/* Event title split into two lines */}
                <View style={styles.titleContainer}>
                  <View style={styles.titleFirstLineContainer}>
                    <Text style={styles.eventTitleFirstLine}>{event.titleFirstLine}</Text>
                  </View>
                  <Text style={styles.eventTitleSecondLine}>{event.titleSecondLine}</Text>
                </View>
                
                {/* Room display */}
                <View style={styles.roomContainerSimple}>
                  <View style={styles.roomBadge}>
                    <Text style={[styles.roomText, { color: event.color }]}>
                      {event.room}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default EventStats;