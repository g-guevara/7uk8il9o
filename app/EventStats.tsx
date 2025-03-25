import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated, ScrollView, Alert } from "react-native";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles/Index.styles";
import { 
  Evento, 
  EventCardData, 
  TimeGap, 
  transformEventsToCardFormat, 
  groupSimilarEvents, 
  parseTime,
  CARD_COLORS 
} from "./EventStatsHelpers";
import { useDataSync } from "./DataProvider/DataSyncContext";

interface EventStatsProps {
  isDarkMode: boolean;
  navigation: NavigationProp<any>;
}

const EventStats: React.FC<EventStatsProps> = ({ isDarkMode, navigation }) => {
  const [selectedEvents, setSelectedEvents] = useState<Evento[]>([]);
  const [cardEvents, setCardEvents] = useState<EventCardData[]>([]);
  const [timeGaps, setTimeGaps] = useState<TimeGap[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Keep track of scroll position
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Get the current date for filtering today's events
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
  // Function to load selected events from AsyncStorage
  const loadSelectedEvents = async () => {
    try {
      setIsLoading(true);
      const jsonValue = await AsyncStorage.getItem("selectedEventos");
      if (jsonValue !== null) {
        const events: Evento[] = JSON.parse(jsonValue);
        
        // Filter events for today
        const todaysEvents = events.filter(event => {
          // Some events might have date in a different format, handle that
          const eventDate = new Date(event.Fecha);
          const eventDateStr = eventDate.toISOString().split('T')[0];
          return eventDateStr === todayStr;
        });
        
        setSelectedEvents(events); // Keep all selected events
        
        // Group events with the same name that occur within 2 hours of each other
        const groupedEvents = groupSimilarEvents(todaysEvents);
        
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
  
  // Load events when component mounts
  useEffect(() => {
    loadSelectedEvents();
  }, []);
  
  // Reload events when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadSelectedEvents();
      return () => {};
    }, [])
  );
  
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
            No tienes eventos para hoy.
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
            {/* Cambiado de TouchableOpacity a View para eliminar el efecto de botón */}
            <View
              style={[
                styles.eventCard,
                { backgroundColor: event.color }
              ]}
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
            </View>
            
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