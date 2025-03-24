import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './DataSyncConstants';
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
 * Check if any sync attempts were missed and handle them
 * This is defined here but will call functions from other modules
 */
export const checkForMissedSyncs = async (): Promise<void> => {
  try {
    const lastSuccessfulSyncStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SUCCESSFUL_SYNC_DATE);
    
    // If no successful sync record exists, this might be the first launch after installation
    // or there might have been a problem with previous syncs
    if (!lastSuccessfulSyncStr) {
      console.log('No successful sync record found, performing sync');
      // We'll import the actual function in the implementing file
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
      // We'll import the actual function in the implementing file
    }
    
    // The checkAndSyncData function will be called from the implementing file
  } catch (error) {
    console.error('Error checking for missed syncs:', error);
    // Try to sync anyway in case of error
  }
};