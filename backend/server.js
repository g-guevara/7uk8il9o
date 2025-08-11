// backend/server.js
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const pushNotificationsRouter = require('./routes/pushNotifications');
const { initializeScheduledNotifications } = require('./scheduledNotifications');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-connection-string';
let db;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });
    await client.connect();
    db = client.db('your-database-name');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Routes for existing functionality
app.get('/eventos', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const eventos = await db.collection('eventos').find({}).toArray();
    res.json(eventos);
  } catch (error) {
    console.error('Error fetching eventos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/all_eventos', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const allEventos = await db.collection('all_eventos').find({}).toArray();
    res.json(allEventos);
  } catch (error) {
    console.error('Error fetching all_eventos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add push notification routes
app.use('/', pushNotificationsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    pushNotifications: 'enabled'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Start server
async function startServer() {
  try {
    // Connect to database first
    await connectToDatabase();
    
    // Initialize scheduled notifications
    initializeScheduledNotifications();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log('Silent push notifications enabled');
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the application
startServer();