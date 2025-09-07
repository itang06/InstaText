import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import WebSocketServer from './ws.js';
import messagesRouter from './routes/messages.js';
import usersRouter from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/messages', messagesRouter);
app.use('/api/users', usersRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'InstaText server is running',
    timestamp: new Date().toISOString()
  });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wsServer = new WebSocketServer(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 InstaText server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export { app, server, wsServer };


