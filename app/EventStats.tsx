import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { styles } from "./styles/Index.styles";

interface EventStatsProps {
  selectedEventos: any[];
  isDarkMode: boolean;
  navigation: NavigationProp<any>;
}

const EventStats: React.FC<EventStatsProps> = ({ selectedEventos, isDarkMode, navigation }) => {
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
