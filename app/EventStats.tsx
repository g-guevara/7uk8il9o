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
  rawStartTime: number; // Added for easier time gap calculation
  rawEndTime: number;   // Added for easier time gap calculation
}

// Interface for time gap display
interface TimeGap {
  id: string;
  hoursDiff: number;
  minutesDiff: number;
}

// Color palette for the cards based on building letter
const CARD_COLORS: Record<string, string> = {
  "A": "#2bb5ec", // Light Blue for building A
  "B": "#2becc6", // Teal for building B
  "C": "#bbef4c", // Green for building C
  "D": "#9d6bce", // Lavender for building D
  "E": "#FFE135", // Yellow for building E
  "F": "#b32580", // Purple for building F
  "default": "#2bb5ec" // Default color (Light Blue)
};

const EventStats: React.FC<EventStatsProps> = ({ isDarkMode, navigation }) => {
  const [selectedEvents, setSelectedEvents] = useState<Evento[]>([]);
  const [cardEvents, setCardEvents] = useState<EventCardData[]>([]);
  const [timeGaps, setTimeGaps] = useState<TimeGap[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Keep track of scroll position
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Helper function to parse time
  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes; // Convert to minutes for easier comparison
  };
  
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
          
          // Sort events by start time
          transformedEvents.sort((a, b) => a.rawStartTime - b.rawStartTime);
          setCardEvents(transformedEvents);
          
          // Calculate time gaps between events
          calculateTimeGaps(transformedEvents);
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
  
  // Calculate time gaps between events
  const calculateTimeGaps = (events: EventCardData[]) => {
    if (events.length <= 1) {
      setTimeGaps([]);
      return;
    }
    
    const gaps: TimeGap[] = [];
    
    for (let i = 0; i < events.length - 1; i++) {
      const currentEvent = events[i];
      const nextEvent = events[i + 1];
      
      // Calculate time difference in minutes
      const timeDiffMinutes = nextEvent.rawStartTime - currentEvent.rawEndTime;
      
      // Only add gap if it's more than 2 hours (120 minutes)
      if (timeDiffMinutes > 120) {
        const hoursDiff = Math.floor(timeDiffMinutes / 60);
        const minutesDiff = timeDiffMinutes % 60;
        
        gaps.push({
          id: `gap-${i}`,
          hoursDiff,
          minutesDiff
        });
      } else {
        // Add a placeholder gap with 0 difference to maintain array alignment
        gaps.push({
          id: `gap-${i}`,
          hoursDiff: 0,
          minutesDiff: 0
        });
      }
    }
    
    setTimeGaps(gaps);
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
    return events.map((event) => {
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
      
      // Get raw time values for calculations
      const rawStartTime = parseTime(event.Inicio);
      const rawEndTime = parseTime(event.Fin);
      
      // Check if this is likely a grouped event (longer duration)
      const duration = rawEndTime - rawStartTime;
      const isGroupedEvent = duration > 120; // If more than 2 hours, probably grouped
      
      // Determine card color based on building letter
      let cardColor = CARD_COLORS.default;
      
      // Extract building letter if the format is correct (space followed by capital letter A-F)
      const buildingMatch = event.Edificio.match(/ ([A-F])/);
      if (buildingMatch && buildingMatch[1]) {
        const buildingLetter = buildingMatch[1]; // Get the matched letter
        cardColor = CARD_COLORS[buildingLetter] || CARD_COLORS.default;
      }
      
      return {
        id: event._id,
        titleFirstLine: titleFirstLine.toUpperCase(), 
        titleSecondLine: titleSecondLine.toUpperCase(), 
        startTime: startTimeParts[0] || "00",
        endTime: endTimeParts[0] || "00",
        startMinutes: startTimeParts[1] || "00",
        endMinutes: endTimeParts[1] || "00",
        room: event.Sala,
        color: cardColor,
        isGrouped: isGroupedEvent,
        rawStartTime,
        rawEndTime
      };
    });
  };
  
  // Component to render the time gap between events
  const TimeGapIndicator = ({ hoursDiff, minutesDiff }: { hoursDiff: number, minutesDiff: number }) => {
    if (hoursDiff === 0 && minutesDiff === 0) {
      return null; // Don't show anything for small gaps
    }
    
    return (
      <View style={styles.timeGapContainer}>
        <View style={styles.timeGapLine} />
        <View style={styles.timeGapBadge}>
          <Text style={styles.timeGapText}>
            {hoursDiff > 0 ? `${hoursDiff}h` : ""} 
            {minutesDiff > 0 ? `${minutesDiff}m` : ""}
          </Text>
        </View>
      </View>
    );
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
        {cardEvents.map((event, index) => (
          <React.Fragment key={`event-block-${event.id}`}>
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
            
            {/* Add time gap indicator if this isn't the last event */}
            {index < timeGaps.length && (
              <TimeGapIndicator 
                hoursDiff={timeGaps[index].hoursDiff} 
                minutesDiff={timeGaps[index].minutesDiff} 
              />
            )}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
};

export default EventStats;