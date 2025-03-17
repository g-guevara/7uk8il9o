import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  initializeDataSync, 
  getStoredEvents, 
  getScheduledUpdateTime,
  Evento 
} from './DataSyncService';

// Define the type for our context
interface DataSyncContextType {
  events: Evento[];
  isLoading: boolean;
  refreshEvents: () => Promise<void>;
  scheduledSyncTime: { hour: number, minutes: number } | null;
}

// Create the context with a default value
export const DataSyncContext = createContext<DataSyncContextType>({
  events: [],
  isLoading: true,
  refreshEvents: async () => {},
  scheduledSyncTime: null
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

  // Load events from AsyncStorage
  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const storedEvents = await getStoredEvents();
      setEvents(storedEvents);
      
      // Load the scheduled sync time
      const time = await getScheduledUpdateTime();
      setScheduledSyncTime(time);
    } catch (error) {
      console.error('Error loading events in context:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh events (can be called manually if needed)
  const refreshEvents = async () => {
    await loadEvents();
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
        scheduledSyncTime
      }}
    >
      {children}
    </DataSyncContext.Provider>
  );
};