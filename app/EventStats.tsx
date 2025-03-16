import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { styles } from "./styles/Index.styles";
import Icon from "react-native-vector-icons/Ionicons";

interface EventStatsProps {
  selectedEventos: any[];
  isDarkMode: boolean;
  navigation: NavigationProp<any>;
}

// Sample data - you should replace this with your actual data
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
    title: "DAILY PROJECT",
    startTime: "12:35",
    endTime: "14:10",
    participants: ["ME", "RICHARD", "ORY", "+4"],
    color: "#B768A2" // Purple
  },
  {
    id: 3,
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

  return (
    <>
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, isDarkMode && styles.darkStatCard]}>
          <Text style={[styles.statValue, isDarkMode && styles.darkText]}>
            {selectedEventos.length}
          </Text>
          <Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>
            Eventos seleccionados
          </Text>
        </View>
      </View>

      {/* Event List */}
      <ScrollView style={styles.eventListContainer}>
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

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.mainButton, isDarkMode && styles.darkMainButton]}
          onPress={() => navigation.navigate("Search" as never)}
        >
          <Text style={styles.mainButtonText}>Buscar Eventos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainButton, isDarkMode && styles.darkMainButton]}
          onPress={() => navigation.navigate("User" as never)}
        >
          <Text style={styles.mainButtonText}>Explorar Todos</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default EventStats;