import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  initializeDataSync, 
  getStoredEvents, 
  getScheduledUpdateTime,
  fetchAndSaveEvents,
  Evento 
} from './DataSyncService';

// Define the type for our context
interface DataSyncContextType {
  events: Evento[];
  isLoading: boolean;
  refreshEvents: () => Promise<void>;
  scheduledSyncTime: { hour: number, minutes: number } | null;
  lastSuccessfulSync: string | null;
}

// Create the context with a default value
export const DataSyncContext = createContext<DataSyncContextType>({
  events: [],
  isLoading: true,
  refreshEvents: async () => {},
  scheduledSyncTime: null,
  lastSuccessfulSync: null
});

// Create a hook for easy context use
export const useDataSync = () => useContext(DataSyncContext);

// Props for the DataSyncProvider
interface DataSyncProviderProps {
  children: React.ReactNode;
}

// Create the provider component
export const DataSyncProvider: React.FC<DataSyncProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scheduledSyncTime, setScheduledSyncTime] = useState<{ hour: number, minutes: number } | null>(null);
  const [lastSuccessfulSync, setLastSuccessfulSync] = useState<string | null>(null);

  // Load events from AsyncStorage
  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const storedEvents = await getStoredEvents();
      setEvents(storedEvents);
      
      // Load the scheduled sync time
      const time = await getScheduledUpdateTime();
      setScheduledSyncTime(time);
      
      // Load last successful sync date
      const lastSyncDate = await AsyncStorage.getItem('last_successful_sync_date');
      setLastSuccessfulSync(lastSyncDate);
    } catch (error) {
      console.error('Error loading events in context:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh events (can be called manually if needed)
  const refreshEvents = async () => {
    setIsLoading(true);
    try {
      // Call fetchAndSaveEvents directly for manual refresh
      const success = await fetchAndSaveEvents(); // This function now returns a boolean
      if (success) {
        // If fetch was successful, reload the events from storage
        const storedEvents = await getStoredEvents();
        setEvents(storedEvents);
        
        // Update the last successful sync date in state
        const lastSyncDate = await AsyncStorage.getItem('last_successful_sync_date');
        setLastSuccessfulSync(lastSyncDate);
      }
    } catch (error) {
      console.error('Error refreshing events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize everything when the component mounts
  useEffect(() => {
    const initialize = async () => {
      await initializeDataSync();
      await loadEvents();
    };
    
    initialize();
  }, []);

  return (
    <DataSyncContext.Provider
      value={{
        events,
        isLoading,
        refreshEvents,
        scheduledSyncTime,
        lastSuccessfulSync
      }}
    >
      {children}
    </DataSyncContext.Provider>
  );
};

// Añadir export default para resolver el warning
const DataSyncContextExports = {
  DataSyncContext,
  useDataSync,
  DataSyncProvider
};

export default DataSyncContextExports;