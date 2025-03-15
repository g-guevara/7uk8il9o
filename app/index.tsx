import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./styles/Index.styles";
import EventStats from "./EventStats";

const Main = () => {
  const [selectedEventos, setSelectedEventos] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const navigation = useNavigation();

  // Load data when component mounts
  useEffect(() => {
    loadData();
    setDefaultDarkMode();
  }, []);
  
  // Also refresh data when screen comes into focus (for theme changes from other screens)
  useFocusEffect(
    React.useCallback(() => {
      loadData();
      return () => {};
    }, [])
  );

  const setDefaultDarkMode = async () => {
    try {
      // Check if we already set a preference
      const value = await AsyncStorage.getItem("isDarkMode");
      if (value === null) {
        // No preference yet, set dark mode as default
        await AsyncStorage.setItem("isDarkMode", "true");
        setIsDarkMode(true);
      }
    } catch (error) {
      console.error("Error setting default dark mode:", error);
    }
  };

  const loadData = async () => {
    try {
      // Load theme preference
      const themeValue = await AsyncStorage.getItem("isDarkMode");
      if (themeValue !== null) {
        setIsDarkMode(themeValue === "true");
      }
      
      // Load selected events
      const jsonValue = await AsyncStorage.getItem("selectedEventos");
      if (jsonValue !== null) {
        setSelectedEventos(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return (
    <>
      {/* Configure StatusBar based on theme */}
      <StatusBar 
        backgroundColor={isDarkMode ? "#121212" : "#FFFFFF"} 
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        translucent={true}
      />
      
      <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkContainer]}>
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
          {/* Botón de usuario en la esquina superior izquierda */}
          <TouchableOpacity
            style={styles.userIconButton}
            onPress={() => navigation.navigate("User" as never)}
          >
            <Icon 
              name="person-circle-outline" 
              size={40} 
              color={isDarkMode ? "#fff" : "#000"} 
            />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, isDarkMode && styles.darkTitle]}>
              Panel Principal
            </Text>
            <Text style={[styles.subtitle, isDarkMode && styles.darkSubTitle]}>
              Gestiona tus eventos universitarios
            </Text>
          </View>

          {/* Componente de estadísticas y botones */}
          <EventStats 
            selectedEventos={selectedEventos} 
            isDarkMode={isDarkMode} 
            navigation={navigation} 
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default Main;