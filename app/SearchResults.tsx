import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { styles } from './styles/Search.styles';
import { Evento } from "./Search";

interface SearchResultsProps {
  isLoading: boolean;
  searchText: string;
  filteredEventos: Evento[];
  isDarkMode: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  isLoading, 
  searchText, 
  filteredEventos, 
  isDarkMode 
}) => {
  return (
    <>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkMode ? "#FFFFFF" : "#000000"} />
        </View>
      ) : searchText.trim() !== "" && filteredEventos.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={[styles.noResultsText, isDarkMode && styles.darkText]}>
            No se encontraron resultados para "{searchText}".
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEventos}
          keyExtractor={(item) => item._id}
          style={styles.eventList}
          ListEmptyComponent={
            !isLoading && filteredEventos.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Text style={[styles.instructionText, isDarkMode && styles.darkText]}>
                  No se encontraron eventos disponibles.
                </Text>
              </View>
            ) : null
          }
          ListHeaderComponent={
            filteredEventos.length > 0 ? (
              <Text style={[styles.resultsCount, isDarkMode && styles.darkText]}>
                {filteredEventos.length} resultado{filteredEventos.length !== 1 ? "s" : ""} encontrado{filteredEventos.length !== 1 ? "s" : ""}
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.cardEventItem,
                isDarkMode && styles.darkCardEventItem
              ]}
            >
              <View style={styles.eventHeader}>
                <Text style={[styles.eventTitle, isDarkMode && styles.darkText]}>
                  {item.Evento}
                </Text>
              </View>
              
              <View style={styles.eventTimeContainer}>
                <Text style={[styles.eventTime, isDarkMode && styles.darkEventTime]}>
                  {item.Tipo} en {item.Campus}, {item.Inicio.substring(0, 5)} - {item.Fin.substring(0, 5)}
                </Text>
              </View>
              
              <View style={[styles.roomNumberContainer, isDarkMode && styles.darkRoomNumberContainer]}>
                <Text style={[styles.roomNumber, isDarkMode && styles.darkRoomNumber]}>
                  {item.Sala} 
                </Text>
              </View>
            </View>
          )}
          numColumns={1}
        />
      )}
    </>
  );
};