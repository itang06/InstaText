import { WebSocketServer as NodeWebSocketServer, WebSocket } from 'ws';

class WebSocketServer {
  constructor(server) {
    this.wss = new NodeWebSocketServer({ server });
    this.clients = new Map(); // Store connected clients
    
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection established');
      
      // Store client connection
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);
      
      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to InstaText WebSocket server',
        clientId: clientId
      }));

      // Handle incoming messages
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(clientId, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        console.log(`Client ${clientId} disconnected`);
        this.clients.delete(clientId);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });
    });
  }

  handleMessage(clientId, message) {
    console.log(`Message from client ${clientId}:`, message);
    
    switch (message.type) {
      case 'chat':
        // Broadcast message to all connected clients with proper user ID
        this.broadcast({
          type: 'chat',
          from: message.from, // Use the actual user ID from the message
          to: message.to,     // Include the recipient user ID
          content: message.content,
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'ping':
        // Respond to ping with pong
        const client = this.clients.get(clientId);
        if (client) {
          client.send(JSON.stringify({
            type: 'pong',
            timestamp: new Date().toISOString()
          }));
        }
        break;
        
      default:
        console.log(`Unknown message type: ${message.type}`);
    }
  }

  broadcast(message) {
    const messageStr = JSON.stringify(message);
    this.clients.forEach((client, clientId) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  generateClientId() {
    return Math.random().toString(36).substr(2, 9);
  }

  getConnectedClients() {
    return this.clients.size;
  }
}

export default WebSocketServer;


