// backend/routes/pushNotifications.js
const express = require('express');
const { Expo } = require('expo-server-sdk');
const router = express.Router();

// Create Expo SDK client
const expo = new Expo();

// In-memory storage for registered devices (use database in production)
const registeredDevices = new Map();

/**
 * Register device for silent push notifications
 */
router.post('/register-device', (req, res) => {
  try {
    const { pushToken, syncHour, syncMinutes, timezone, deviceInfo } = req.body;
    
    // Validate push token
    if (!pushToken || !Expo.isExpoPushToken(pushToken)) {
      return res.status(400).json({ 
        error: 'Invalid or missing push token',
        received: pushToken 
      });
    }
    
    // Validate sync time
    if (typeof syncHour !== 'number' || typeof syncMinutes !== 'number' || 
        syncHour < 0 || syncHour > 23 || syncMinutes < 0 || syncMinutes > 59) {
      return res.status(400).json({ 
        error: 'Invalid sync time',
        received: { syncHour, syncMinutes }
      });
    }
    
    // Store device registration
    registeredDevices.set(pushToken, {
      syncHour,
      syncMinutes,
      timezone: timezone || 'UTC',
      deviceInfo: deviceInfo || {},
      registeredAt: new Date().toISOString(),
      lastNotificationSent: null,
    });
    
    console.log(`Device registered: ${pushToken.substring(0, 20)}... for ${syncHour.toString().padStart(2, '0')}:${syncMinutes.toString().padStart(2, '0')}`);
    console.log(`Total registered devices: ${registeredDevices.size}`);
    
    res.json({ 
      success: true, 
      message: 'Device registered successfully for silent push notifications',
      syncTime: `${syncHour.toString().padStart(2, '0')}:${syncMinutes.toString().padStart(2, '0')}`,
      totalDevices: registeredDevices.size
    });
    
  } catch (error) {
    console.error('Error registering device:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

/**
 * Unregister device from silent push notifications
 */
router.post('/unregister-device', (req, res) => {
  try {
    const { pushToken } = req.body;
    
    if (!pushToken) {
      return res.status(400).json({ error: 'Push token is required' });
    }
    
    const wasRegistered = registeredDevices.has(pushToken);
    registeredDevices.delete(pushToken);
    
    console.log(`Device unregistered: ${pushToken.substring(0, 20)}... (was registered: ${wasRegistered})`);
    console.log(`Remaining registered devices: ${registeredDevices.size}`);
    
    res.json({ 
      success: true, 
      message: 'Device unregistered successfully',
      wasRegistered,
      remainingDevices: registeredDevices.size
    });
    
  } catch (error) {
    console.error('Error unregistering device:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

/**
 * Send silent notification to specific device (for testing)
 */
router.post('/send-silent-notification', async (req, res) => {
  try {
    const { pushToken, data = {} } = req.body;
    
    if (!pushToken || !Expo.isExpoPushToken(pushToken)) {
      return res.status(400).json({ error: 'Invalid push token' });
    }

    const result = await sendSilentPushNotification(pushToken, data);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Silent notification sent successfully',
        tickets: result.tickets 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to send notification',
        details: result.error 
      });
    }
    
  } catch (error) {
    console.error('Error sending silent notification:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

/**
 * Get statistics about registered devices (for monitoring)
 */
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalDevices: registeredDevices.size,
      devicesByHour: {},
      lastNotificationsSent: 0,
    };
    
    // Group devices by sync hour
    for (const [token, info] of registeredDevices) {
      const hour = info.syncHour.toString().padStart(2, '0');
      if (!stats.devicesByHour[hour]) {
        stats.devicesByHour[hour] = 0;
      }
      stats.devicesByHour[hour]++;
      
      if (info.lastNotificationSent) {
        stats.lastNotificationsSent++;
      }
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Function to send silent push notification
 */
async function sendSilentPushNotification(pushToken, additionalData = {}) {
  try {
    if (!Expo.isExpoPushToken(pushToken)) {
      return { success: false, error: 'Invalid push token' };
    }

    const message = {
      to: pushToken,
      data: {
        silent: true,
        action: 'sync',
        timestamp: new Date().toISOString(),
        ...additionalData,
      },
      priority: 'normal',
      // Important: No title, body, sound, or badge for silent notifications
    };

    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    // Update last notification sent time
    if (registeredDevices.has(pushToken)) {
      const deviceInfo = registeredDevices.get(pushToken);
      deviceInfo.lastNotificationSent = new Date().toISOString();
      registeredDevices.set(pushToken, deviceInfo);
    }

    console.log(`Silent notification sent to ${pushToken.substring(0, 20)}...`);
    return { success: true, tickets };
    
  } catch (error) {
    console.error(`Error sending notification to ${pushToken.substring(0, 20)}...:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Function to send scheduled silent notifications (called by cron)
 */
async function sendScheduledSilentNotifications() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  console.log(`Checking for scheduled notifications at ${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`);

  let notificationsSent = 0;
  const promises = [];

  for (const [pushToken, deviceInfo] of registeredDevices) {
    // Check if it's time for this device's sync
    if (deviceInfo.syncHour === currentHour && deviceInfo.syncMinutes === currentMinutes) {
      console.log(`Sending scheduled notification to device at ${currentHour}:${currentMinutes}`);
      
      const promise = sendSilentPushNotification(pushToken, {
        scheduled: true,
        syncTime: `${currentHour}:${currentMinutes}`,
      });
      
      promises.push(promise);
      notificationsSent++;
    }
  }

  // Wait for all notifications to be sent
  if (promises.length > 0) {
    try {
      await Promise.all(promises);
      console.log(`Successfully sent ${notificationsSent} scheduled silent notifications`);
    } catch (error) {
      console.error('Error sending some scheduled notifications:', error);
    }
  }

  return notificationsSent;
}

// Export the function for use in cron job
router.sendScheduledSilentNotifications = sendScheduledSilentNotifications;

module.exports = router;