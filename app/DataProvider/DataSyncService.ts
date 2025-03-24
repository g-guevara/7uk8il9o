import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './DataSyncConstants';
import { Evento } from './DataSyncTypes';
import { 
  checkFirstLaunch, 
  setFirstLaunchComplete,
  setupRandomTimeValues, 
  getScheduledUpdateTime,
  checkForMissedSyncs
} from './DataSyncUtils';
import { fetchAndSaveEvents } from './DataSyncFetch';
import { checkAndSyncData } from './DataSyncSchedule';

/**
 * Initialize the data sync service
 * Call this when the app starts
 */
const initializeDataSync = async (): Promise<void> => {
  const isFirstLaunch = await checkFirstLaunch();
  
  if (isFirstLaunch) {
    console.log('First launch detected, setting up...');
    await setupRandomTimeValues();
    await fetchAndSaveEvents();
    await setFirstLaunchComplete();
  } else {
    // Check for missed syncs immediately when app starts
    await checkForMissedSyncs();
  }
  
  // Set up a recurring check every minute to see if we need to sync
  // In a real app, you might want to use a more efficient approach
  setInterval(checkAndSyncData, 60000); // 60000 ms = 1 minute
};

/**
 * Get the stored events data
 */
const getStoredEvents = async (): Promise<Evento[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS_DATA);
    if (!data) {
      console.log('No hay datos en AsyncStorage, intentando obtenerlos del servidor...');
      await fetchAndSaveEvents();
      const freshData = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS_DATA);
      return freshData ? JSON.parse(freshData) : [];
    }
    
    const events = JSON.parse(data);
    console.log(`Recuperados ${events.length} eventos de AsyncStorage`);
    return events;
  } catch (error) {
    console.error('Error getting stored events:', error);
    return [];
  }
};

// Re-export utility functions for backwards compatibility
export { getScheduledUpdateTime } from './DataSyncUtils';
export { fetchAndSaveEvents } from './DataSyncFetch';
export { checkAndSyncData } from './DataSyncSchedule';

// Export main functions for use in other components
export {
  initializeDataSync,
  getStoredEvents
};