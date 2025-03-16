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
    title: "DESIGN MEETING",
    startTime: "11:30",
    endTime: "12:20",
    participants: ["ALEX", "HELENA", "NANA"],
    color: "#FFE135" // Yellow
  },
  {
    id: 2,
    title: "DESIGN MEETING",
    startTime: "11:30",
    endTime: "12:20",
    participants: ["ALEX", "HELENA", "NANA"],
    color: "#FFE135" // Yellow
  },
  {
    id: 3,
    title: "DESIGN MEETING",
    startTime: "11:30",
    endTime: "12:20",
    participants: ["ALEX", "HELENA", "NANA"],
    color: "#FFE135" // Yellow
  },
  {
    id: 4,
    title: "DESIGN MEETING",
    startTime: "11:30",
    endTime: "12:20",
    participants: ["ALEX", "HELENA", "NANA"],
    color: "#FFE135" // Yellow
  },
  {
    id: 5,
    title: "DAILY PROJECT",
    startTime: "12:35",
    endTime: "14:10",
    participants: ["ME", "RICHARD", "ORY", "+4"],
    color: "#B768A2" // Purple
  },
  {
    id: 6,
    title: "WEEKLY PLANNING",
    startTime: "15:00",
    endTime: "16:30",
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
              console.log(`Pressed on event: ${event.title}`);
            }}
          >
            {/* Time information */}
            <View style={styles.eventTimeContainer}>
              <Text style={styles.eventTimeText}>{event.startTime}</Text>
              <Text style={styles.eventTimeText}>{event.endTime}</Text>
            </View>
            
            {/* Event title */}
            <Text style={styles.eventTitleText}>{event.title}</Text>
            
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
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default EventStats;