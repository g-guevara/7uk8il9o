import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDataSync } from './DataSyncContext';

interface DataSyncInfoProps {
  isDarkMode: boolean;
}

const DataSyncInfo: React.FC<DataSyncInfoProps> = ({ isDarkMode }) => {
  const { scheduledSyncTime, refreshEvents } = useDataSync();

  // Format time with leading zeros
  const formatTime = (hour: number, minutes: number) => {
    return `0${hour}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  const handleManualSync = () => {
    refreshEvents();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>
        Sincronización de datos
      </Text>
      
      {scheduledSyncTime ? (
        <Text style={[styles.syncTime, isDarkMode && styles.darkText]}>
          Los datos se actualizan automáticamente a las {formatTime(scheduledSyncTime.hour, scheduledSyncTime.minutes)} cada día.
        </Text>
      ) : (
        <Text style={[styles.syncTime, isDarkMode && styles.darkText]}>
          Cargando horario de sincronización...
        </Text>
      )}
      
      <TouchableOpacity
        style={[styles.syncButton, isDarkMode && styles.darkSyncButton]}
        onPress={handleManualSync}
      >
        <Text style={[styles.syncButtonText, isDarkMode && styles.darkSyncButtonText]}>
          Sincronizar ahora
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  syncTime: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  syncButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignSelf: 'flex-start',
  },
  syncButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSyncButton: {
    backgroundColor: '#FFFFFF',
  },
  darkSyncButtonText: {
    color: '#000000',
  },
});

export default DataSyncInfo;