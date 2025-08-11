// backend/scheduledNotifications.js
const cron = require('node-cron');
const pushNotificationsRouter = require('./routes/pushNotifications');

/**
 * Set up cron job to send silent push notifications at scheduled times
 */
function initializeScheduledNotifications() {
  console.log('Initializing scheduled silent push notifications...');
  
  // Run every minute to check for scheduled notifications
  const cronJob = cron.schedule('* * * * *', async () => {
    try {
      const notificationsSent = await pushNotificationsRouter.sendScheduledSilentNotifications();
      
      if (notificationsSent > 0) {
        const now = new Date();
        console.log(`[${now.toISOString()}] Sent ${notificationsSent} scheduled silent notifications`);
      }
    } catch (error) {
      console.error('Error in scheduled notifications cron job:', error);
    }
  }, {
    scheduled: true,
    timezone: "UTC" // Use UTC for consistency
  });

  console.log('Scheduled notifications cron job started (runs every minute)');
  
  return cronJob;
}

/**
 * Manual function to trigger scheduled notifications (for testing)
 */
async function triggerScheduledNotifications() {
  try {
    console.log('Manually triggering scheduled notifications...');
    const notificationsSent = await pushNotificationsRouter.sendScheduledSilentNotifications();
    console.log(`Manually sent ${notificationsSent} notifications`);
    return notificationsSent;
  } catch (error) {
    console.error('Error in manual trigger:', error);
    return 0;
  }
}

/**
 * Get cron job status
 */
function getSchedulerStatus() {
  return {
    isRunning: true,
    nextRun: 'Every minute',
    timezone: 'UTC',
    uptime: process.uptime(),
  };
}

module.exports = {
  initializeScheduledNotifications,
  triggerScheduledNotifications,
  getSchedulerStatus,
};