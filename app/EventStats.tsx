import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated, ScrollView } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { styles } from "./styles/Index.styles";

interface EventStatsProps {
  selectedEventos: any[];
  isDarkMode: boolean;
  navigation: NavigationProp<any>;
}

// Sample data - replace with your actual data
const sampleEvents = [
  {
    id: 1,
    titleFirstLine: "DESIGN",
    titleSecondLine: "MEETING",
    startTime: "11",
    endTime: "12",
    startMinutes: "30",
    endMinutes: "20",
    participants: ["ALEX", "HELENA", "NANA"],
    color: "#FFE135" // Yellow
  },
  {
    id: 2,
    titleFirstLine: "DESIGN",
    titleSecondLine: "MEETING",
    startTime: "11",
    endTime: "12",
    startMinutes: "30",
    endMinutes: "20",
    participants: ["ALEX", "HELENA", "NANA"],
    color: "#FFE135" // Yellow
  },
  {
    id: 3,
    titleFirstLine: "DESIGN",
    titleSecondLine: "MEETING",
    startTime: "11",
    endTime: "12",
    startMinutes: "30",
    endMinutes: "20",
    participants: ["ALEX", "HELENA", "NANA"],
    color: "#FFE135" // Yellow
  },
  {
    id: 4,
    titleFirstLine: "DESIGN",
    titleSecondLine: "MEETING",
    startTime: "11",
    endTime: "12",
    startMinutes: "30",
    endMinutes: "20",
    participants: ["ALEX", "HELENA", "NANA"],
    color: "#FFE135" // Yellow
  },
  {
    id: 5,
    titleFirstLine: "DAILY",
    titleSecondLine: "PROJECT",
    startTime: "12",
    endTime: "14",
    startMinutes: "35",
    endMinutes: "10",
    participants: ["ME", "RICHARD", "ORY", "+4"],
    color: "#B768A2" // Purple
  },
  {
    id: 6,
    titleFirstLine: "WEEKLY",
    titleSecondLine: "PLANNING",
    startTime: "15",
    endTime: "16",
    startMinutes: "00",
    endMinutes: "30",
    participants: [],
    color: "#9ACD32" // Green
  }
];

const EventStats: React.FC<EventStatsProps> = ({ selectedEventos, isDarkMode, navigation }) => {
  // You might want to use the selectedEventos data instead of sampleEvents
  // when you have the proper data structure
  const eventsToDisplay = sampleEvents;
  
  // Keep track of scroll position
  const scrollY = useRef(new Animated.Value(0)).current;
  
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
        {eventsToDisplay.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={[
              styles.eventCard,
              { backgroundColor: event.color }
            ]}
            onPress={() => {
              // You can add navigation to event details or other actions here
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
                {/* Event title split into two lines with configurable spacing */}
                <View style={styles.titleContainer}>
                  <Text style={styles.eventTitleFirstLine}>{event.titleFirstLine}</Text>
                  <View style={styles.titleSpacer} />
                  <Text style={styles.eventTitleSecondLine}>{event.titleSecondLine}</Text>
                </View>
                
                {/* Participants */}
                {event.participants.length > 0 && (
                  <View style={styles.eventParticipantsContainer}>
                    {event.participants.map((participant, index) => (
                      <Text key={index} style={styles.eventParticipantText}>
                        {participant}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default EventStats;