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
  isGrouped?: boolean;
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
          
          // Group events with the same name that occur within 2 hours of each other
          const groupedEvents = groupSimilarEvents(events);
          
          // Transform the events to the card format
          const transformedEvents = transformEventsToCardFormat(groupedEvents);
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
  
  // Helper function to parse time
  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes; // Convert to minutes for easier comparison
  };
  
  // Function to group similar events
  const groupSimilarEvents = (events: Evento[]): Evento[] => {
    if (events.length <= 1) return events;
    
    // First, sort events by start time
    const sortedEvents = [...events].sort((a, b) => {
      return parseTime(a.Inicio) - parseTime(b.Inicio);
    });
    
    const result: Evento[] = [];
    let currentGroup: Evento[] = [sortedEvents[0]];
    
    // Process events to group them if they have the same name and occur close in time
    for (let i = 1; i < sortedEvents.length; i++) {
      const currentEvent = sortedEvents[i];
      const lastEvent = currentGroup[currentGroup.length - 1];
      
      // Check if events have the same name
      if (currentEvent.Evento === lastEvent.Evento) {
        // Calculate time difference in minutes
        const lastEventEndTime = parseTime(lastEvent.Fin);
        const currentEventStartTime = parseTime(currentEvent.Inicio);
        const timeDifference = currentEventStartTime - lastEventEndTime;
        
        // If the time difference is less than 2 hours (120 minutes), group them
        if (timeDifference < 120) {
          currentGroup.push(currentEvent);
          continue;
        }
      }
      
      // If we reach here, we need to finalize the current group and start a new one
      if (currentGroup.length === 1) {
        // Just a single event, add it as is
        result.push(currentGroup[0]);
      } else {
        // Create a combined event
        const firstEvent = currentGroup[0];
        const lastEvent = currentGroup[currentGroup.length - 1];
        
        result.push({
          ...firstEvent,
          Inicio: firstEvent.Inicio,
          Fin: lastEvent.Fin,
          // We could add a note that this is a combined event if needed
        });
      }
      
      // Start a new group with the current event
      currentGroup = [currentEvent];
    }
    
    // Don't forget to add the last group
    if (currentGroup.length === 1) {
      result.push(currentGroup[0]);
    } else if (currentGroup.length > 1) {
      const firstEvent = currentGroup[0];
      const lastEvent = currentGroup[currentGroup.length - 1];
      
      result.push({
        ...firstEvent,
        Inicio: firstEvent.Inicio,
        Fin: lastEvent.Fin,
      });
    }
    
    return result;
  };
  
  // Transform the event data to the format needed for the cards
  const transformEventsToCardFormat = (events: Evento[]): EventCardData[] => {
    return events.map((event, index) => {
      // Get the event title and handle any truncation needed
      let eventTitle = event.Evento;
      
      // If the title contains "Sec", cut everything from "Sec" onwards
      const secIndex = eventTitle.indexOf("Sec");
      if (secIndex !== -1) {
        eventTitle = eventTitle.substring(0, secIndex).trim();
      }
      
      // Get first word for the first line
      const words = eventTitle.split(' ');
      let titleFirstLine = words[0] || ""; // First word only
      let titleSecondLine = words.slice(1).join(' '); // Rest of the words
      
      // If there's only one word, use the event type as the second line
      if (words.length <= 1) {
        titleSecondLine = event.Tipo;
      }
      
      // Extract hours and minutes from start and end times
      const startTimeParts = event.Inicio.split(':');
      const endTimeParts = event.Fin.split(':');
      
      // Check if this is likely a grouped event (longer duration)
      const startTime = parseTime(event.Inicio);
      const endTime = parseTime(event.Fin);
      const duration = endTime - startTime;
      const isGroupedEvent = duration > 120; // If more than 2 hours, probably grouped
      
      return {
        id: event._id,
        titleFirstLine: titleFirstLine,
        titleSecondLine: isGroupedEvent ? `${titleSecondLine} (Sesión múltiple)` : titleSecondLine,
        startTime: startTimeParts[0] || "00",
        endTime: endTimeParts[0] || "00",
        startMinutes: startTimeParts[1] || "00",
        endMinutes: endTimeParts[1] || "00",
        room: event.Sala,
        color: CARD_COLORS[index % CARD_COLORS.length], // Cycle through colors
        isGrouped: isGroupedEvent
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
                    <Text 
                      style={styles.eventTitleFirstLine} 
                      numberOfLines={1}
                      adjustsFontSizeToFit={true}
                      minimumFontScale={0.5}
                    >
                      {event.titleFirstLine.toUpperCase()}
                    </Text>
                  </View>
                  <Text 
                    style={styles.eventTitleSecondLine} 
                    numberOfLines={2} 
                    ellipsizeMode="tail"
                  >
                    {event.titleSecondLine}
                  </Text>
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