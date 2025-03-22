import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the interface for events
export interface Evento {
  _id: string;
  Tipo: string;
  Evento: string;
  Fecha: string;
  Inicio: string;
  Fin: string;
  Sala: string;
  Edificio: string;
  Campus: string;
  fechaActualizacion: string;
}

const API_BASE_URL = 'https://7uk8il9o.vercel.app';

// Keys for AsyncStorage
const STORAGE_KEYS = {
  FIRST_LAUNCH: 'app_first_launch',
  GROUP_TICKET_HOUR: 'groupticketHour',
  GROUP_TICKET_MINUTES: 'groupticketminutes',
  EVENTS_DATA: 'events_data',
  ALL_EVENTS_DATA: 'all_events_data',
  LAST_SYNC_DATE: 'last_sync_date',
  LAST_SUCCESSFUL_SYNC_DATE: 'last_successful_sync_date',
  SYNC_ATTEMPT_DATE: 'sync_attempt_date'
};

/**
 * Generate a random integer between min and max (inclusive)
 */
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Check if this is the first time the app is launched
 */
const checkFirstLaunch = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
    return value === null; // If null, it's the first launch
  } catch (error) {
    console.error('Error checking first launch:', error);
    return false;
  }
};

/**
 * Set the first launch flag to false
 */
const setFirstLaunchComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
  } catch (error) {
    console.error('Error setting first launch complete:', error);
  }
};

/**
 * Generate and save random time values for scheduled updates
 */
const setupRandomTimeValues = async (): Promise<{ hour: number, minutes: number }> => {
  try {
    const hour = getRandomInt(3, 4);
    const minutes = getRandomInt(1, 59);
    
    await AsyncStorage.setItem(STORAGE_KEYS.GROUP_TICKET_HOUR, hour.toString());
    await AsyncStorage.setItem(STORAGE_KEYS.GROUP_TICKET_MINUTES, minutes.toString());
    
    console.log(`Random update time set to 0${hour}:${minutes}`);
    return { hour, minutes };
  } catch (error) {
    console.error('Error setting up random time values:', error);
    // Default values if there's an error
    return { hour: 2, minutes: 30 };
  }
};

/**
 * Get the stored time values for scheduled updates
 */
const getScheduledUpdateTime = async (): Promise<{ hour: number, minutes: number }> => {
  try {
    const hour = await AsyncStorage.getItem(STORAGE_KEYS.GROUP_TICKET_HOUR);
    const minutes = await AsyncStorage.getItem(STORAGE_KEYS.GROUP_TICKET_MINUTES);
    
    if (hour !== null && minutes !== null) {
      return { 
        hour: parseInt(hour, 10), 
        minutes: parseInt(minutes, 10) 
      };
    } else {
      // If the values aren't set yet, set them up
      return await setupRandomTimeValues();
    }
  } catch (error) {
    console.error('Error getting scheduled update time:', error);
    // Default values if there's an error
    return { hour: 2, minutes: 30 };
  }
};

/**
 * Fetch events from the API and save them locally
 */
const fetchAndSaveEvents = async (): Promise<boolean> => {
  try {
    // Record sync attempt date regardless of success
    const attemptDate = new Date().toISOString();
    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_ATTEMPT_DATE, attemptDate);
    
    // Fetch events from the 'eventos' collection
    const eventsResponse = await fetch(`${API_BASE_URL}/eventos`);
    if (!eventsResponse.ok) {
      throw new Error(`HTTP error! Status: ${eventsResponse.status}`);
    }
    const eventsData: Evento[] = await eventsResponse.json();
    
    // Save events data to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.EVENTS_DATA, JSON.stringify(eventsData));
    
    // TODO: Add endpoint for 'all_events' collection once it's available
    // For now, we'll just log this as a placeholder
    console.log('Note: Endpoint for all_events collection not implemented yet');
    
    // Update last sync date
    const currentDate = new Date().toISOString();
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC_DATE, currentDate);
    
    // Update last successful sync date
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SUCCESSFUL_SYNC_DATE, currentDate);
    
    console.log('Data sync completed successfully');
    return true;
  } catch (error) {
    console.error('Error fetching and saving events:', error);
    return false;
  }
};

/**
 * Check if any sync attempts were missed and handle them
 */
const checkForMissedSyncs = async (): Promise<void> => {
  try {
    const lastSuccessfulSyncStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SUCCESSFUL_SYNC_DATE);
    
    // If no successful sync record exists, this might be the first launch after installation
    // or there might have been a problem with previous syncs
    if (!lastSuccessfulSyncStr) {
      console.log('No successful sync record found, performing sync');
      await fetchAndSaveEvents();
      return;
    }
    
    const lastSuccessfulSync = new Date(lastSuccessfulSyncStr);
    const now = new Date();
    
    // Calculate days difference
    const daysDifference = Math.floor((now.getTime() - lastSuccessfulSync.getTime()) / (1000 * 60 * 60 * 24));
    
    // If more than 1 day has passed since the last successful sync
    // This likely means the device was turned off during scheduled syncs
    if (daysDifference > 1) {
      console.log(`${daysDifference} days since last successful sync, performing catch-up sync`);
      await fetchAndSaveEvents();
    } else {
      // Normal check based on today's schedule
      await checkAndSyncData();
    }
  } catch (error) {
    console.error('Error checking for missed syncs:', error);
    // Try to sync anyway in case of error
    await fetchAndSaveEvents();
  }
};

/**
 * Check if we need to sync data based on the scheduled time
 */
const checkAndSyncData = async (): Promise<void> => {
  try {
    const lastSyncDateStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC_DATE);
    const lastSuccessfulSyncDateStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SUCCESSFUL_SYNC_DATE);
    const { hour, minutes } = await getScheduledUpdateTime();
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Get the date part only (year, month, day) for comparison
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // If it's the first time or we're at the scheduled time, sync the data
    if (!lastSyncDateStr || (currentHour === hour && currentMinutes === minutes)) {
      console.log('Time to sync data!');
      await fetchAndSaveEvents();
    } else {
      // Check if we missed the sync time
      
      // If we have a last sync date but no successful sync, we might have had a failed attempt
      if (lastSyncDateStr && !lastSuccessfulSyncDateStr) {
        console.log('Previous sync attempt detected but no successful sync record, trying again');
        await fetchAndSaveEvents();
        return;
      }
      
      // Parse the dates for comparison
      const lastSuccessfulSyncDate = lastSuccessfulSyncDateStr ? new Date(lastSuccessfulSyncDateStr) : null;
      
      if (lastSuccessfulSyncDate) {
        // Get just the date part (year, month, day)
        const lastSuccessfulSyncDay = new Date(
          lastSuccessfulSyncDate.getFullYear(), 
          lastSuccessfulSyncDate.getMonth(), 
          lastSuccessfulSyncDate.getDate()
        );
        
        // Calculate the expected next sync day (adding 1 day to last successful sync)
        const expectedNextSyncDay = new Date(lastSuccessfulSyncDay);
        expectedNextSyncDay.setDate(expectedNextSyncDay.getDate() + 1);
        
        // If current date is after the expected next sync day, we missed at least one sync
        if (nowDate > expectedNextSyncDay) {
          console.log('Missed scheduled sync due to device being off, syncing now');
          await fetchAndSaveEvents();
          return;
        }
        
        // If it's the same day as expected next sync but after scheduled time
        if (nowDate.getTime() === expectedNextSyncDay.getTime() && 
            (currentHour > hour || (currentHour === hour && currentMinutes > minutes))) {
          console.log('On sync day and scheduled time has passed, syncing now');
          await fetchAndSaveEvents();
          return;
        }
      }
      
      // Standard check if we missed the sync time today
      if (lastSyncDateStr) {
        const lastSyncDate = new Date(lastSyncDateStr);
        const lastSyncDay = new Date(
          lastSyncDate.getFullYear(), 
          lastSyncDate.getMonth(), 
          lastSyncDate.getDate()
        );
        
        // If the last sync was before today and the scheduled time has already passed today, sync now
        if (lastSyncDay < nowDate && 
            (currentHour > hour || (currentHour === hour && currentMinutes > minutes))) {
          console.log('Missed scheduled sync for today, doing it now');
          await fetchAndSaveEvents();
        }
      }
    }
  } catch (error) {
    console.error('Error checking and syncing data:', error);
  }
};

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
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting stored events:', error);
    return [];
  }
};

// Export the functions for use in other components
// Fixed: removed Evento from here since it's already exported as an interface above
export {
  initializeDataSync,
  getStoredEvents,
  getScheduledUpdateTime,
  fetchAndSaveEvents,
  checkAndSyncData
};