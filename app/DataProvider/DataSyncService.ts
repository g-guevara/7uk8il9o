import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, API_BASE_URL } from './DataSyncConstants';
import { Evento } from './DataSyncTypes';

/**
 * Generate a random integer between min and max (inclusive)
 */
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Check if this is the first time the app is launched
 */
export const checkFirstLaunch = async (): Promise<boolean> => {
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
export const setFirstLaunchComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
  } catch (error) {
    console.error('Error setting first launch complete:', error);
  }
};

/**
 * Generate and save random time values for scheduled updates
 */
export const setupRandomTimeValues = async (): Promise<{ hour: number, minutes: number }> => {
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
export const getScheduledUpdateTime = async (): Promise<{ hour: number, minutes: number }> => {
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
export const fetchAndSaveEvents = async (): Promise<boolean> => {
  try {
    // Record sync attempt date regardless of success
    const attemptDate = new Date().toISOString();
    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_ATTEMPT_DATE, attemptDate);
    
    console.log('Iniciando fetch de all_eventos...');
    // Fetch events from the 'all_eventos' collection
    const eventsResponse = await fetch(`${API_BASE_URL}/all_eventos`);
    if (!eventsResponse.ok) {
      throw new Error(`HTTP error! Status: ${eventsResponse.status}`);
    }
    
    const eventsData: Evento[] = await eventsResponse.json();
    console.log(`Recibidos ${eventsData.length} eventos del servidor`);
    
    // Process events if needed - añadir día de semana si no existe
    const processedEvents = processEventsData(eventsData);
    
    // Save events data to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.EVENTS_DATA, JSON.stringify(processedEvents));
    
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
 * Process events data to add weekday if it doesn't exist
 */
function processEventsData(eventsData: Evento[]): Evento[] {
  return eventsData.map(event => {
    if (!event.diaSemana && event.Fecha) {
      try {
        const fecha = new Date(event.Fecha);
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        event.diaSemana = diasSemana[fecha.getDay()];
      } catch (error) {
        console.warn(`Error procesando fecha para evento ${event._id}:`, error);
      }
    }
    return event;
  });
}

/**
 * Initialize data synchronization
 */
export const initializeDataSync = async (): Promise<void> => {
  try {
    // Check if it's the first launch
    const isFirstLaunch = await checkFirstLaunch();
    
    if (isFirstLaunch) {
      console.log('First launch detected, initializing data sync...');
      // Set up random time for updates
      await setupRandomTimeValues();
      // Perform initial data fetch
      await fetchAndSaveEvents();
      // Mark first launch as complete
      await setFirstLaunchComplete();
    } else {
      console.log('Not first launch, checking for missed syncs...');
      // Check if any scheduled syncs were missed
      await checkForMissedSyncs();
    }
  } catch (error) {
    console.error('Error initializing data sync:', error);
  }
};

/**
 * Check if any sync attempts were missed and handle them
 */
export const checkForMissedSyncs = async (): Promise<void> => {
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
    }
    
    // Perform regular check for today's sync
    await checkAndSyncData();
  } catch (error) {
    console.error('Error checking for missed syncs:', error);
    // Try to sync anyway in case of error
    await fetchAndSaveEvents();
  }
};

/**
 * Check if we need to sync data based on the scheduled time
 */
export const checkAndSyncData = async (): Promise<void> => {
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
      return;
    }
    
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
  } catch (error) {
    console.error('Error checking and syncing data:', error);
  }
};

/**
 * Get stored events from AsyncStorage
 */
export const getStoredEvents = async (): Promise<Evento[]> => {
  try {
    const eventsJson = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS_DATA);
    if (eventsJson) {
      return JSON.parse(eventsJson);
    }
    return [];
  } catch (error) {
    console.error('Error getting stored events:', error);
    return [];
  }
};