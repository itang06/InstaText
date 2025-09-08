# 💬 InstaText

A modern, real-time text messaging application built with cutting-edge web technologies. InstaText provides instant messaging capabilities with a clean, responsive interface and real-time communication powered by WebSockets.

![InstaText](https://img.shields.io/badge/Status-Active-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue)

## ✨ Features

- 🚀 **Real-time messaging** with WebSocket connections
- 💻 **Modern UI** built with React and Tailwind CSS
- 🔄 **Live connection status** indicators with visual feedback
- 📱 **Responsive design** for all devices
- 🗄️ **PostgreSQL database** for message persistence
- ⚡ **Fast development** with hot reloading
- 🛡️ **CORS enabled** for cross-origin requests
- 📋 **About modal** with app information
- 🎯 **Simplified user experience** - no login required

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Next.js 14** - Full-stack React framework
- **Tailwind CSS** - Utility-first CSS framework
- **WebSocket Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **WebSocket (ws)** - Real-time bidirectional communication
- **PostgreSQL** - Relational database

## 📁 Project Structure

```
instatext/
├── 📁 client/                 # Next.js frontend application
│   ├── 📁 components/         # Reusable React components
│   │   ├── About.jsx          # About modal component
│   │   ├── ConnectionStatus.jsx
│   │   └── MessageBubble.jsx
│   ├──  pages/             # Next.js pages
│   │   ├── _app.jsx
│   │   └── index.jsx
│   ├──  styles/            # Global styles
│   │   └── globals.css
│   └── 📄 package.json
├── 📁 server/                # Express + WebSocket backend
│   ├──  db/                # Database configuration
│   │   └── index.js
│   ├──  routes/            # API route handlers
│   │   ├── messages.js
│   │   └── users.js
│   ├──  index.js           # Express server entry point
│   ├──  ws.js              # WebSocket server setup
│   └── 📄 package.json
├── 📄 package.json           # Root package configuration
└── 📄 README.md
```

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v13 or higher) - [Download here](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd instatext

# Install all dependencies (root, server, and client)
npm run install:all
```

### 2. Database Setup

1. **Start PostgreSQL** service on your machine
2. **Create a database** named `instatext`:
   ```sql
   CREATE DATABASE instatext;
   ```

3. **Configure environment variables** (optional):
   Create a `.env` file in the `server/` directory:
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=instatext
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```

### 3. Run the Application

#### Option A: Run Everything Together (Recommended)
```bash
npm run dev
```

#### Option B: Run Separately
```bash
# Terminal 1 - Backend Server
npm run dev:server

# Terminal 2 - Frontend Client
npm run dev:client
```

### 4. Access the Application

- 🌐 **Frontend**: [http://localhost:3000](http://localhost:3000) (or 3001 if 3000 is in use)
- 🔧 **Backend API**: [http://localhost:4000](http://localhost:4000)
- ❤️ **Health Check**: [http://localhost:4000/health](http://localhost:4000/health)
- 🔌 **WebSocket**: `ws://localhost:4000`

### 5. How to Use

1. **Open the app** in your browser
2. **Select a user** from the list to start texting
3. **Type messages** and press Enter or click Send
4. **Messages appear instantly** in real-time across all open tabs
5. **Check connection status** - green dot means connected, red means disconnected

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check endpoint |
| `GET` | `/api/messages/conversation` | Get conversation between users |
| `POST` | `/api/messages` | Create a new message |
| `GET` | `/api/users` | Get all users |

##  WebSocket Events

| Event | Description | Data |
|-------|-------------|------|
| `connection` | Client connects to server | `{ type: 'connection', message: string, clientId: string }` |
| `chat` | Send/receive text messages | `{ type: 'chat', from: number, to: number, content: string, timestamp: string }` |
| `ping` | Connection health check | `{ type: 'ping' }` |
| `pong` | Server response to ping | `{ type: 'pong', timestamp: string }` |
| `disconnect` | Client disconnects | - |

## 🎯 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:server` | Start only the backend server |
| `npm run dev:client` | Start only the frontend client |
| `npm run install:all` | Install dependencies for all packages |

## 🔧 Development

### Adding New Features

1. **Frontend Components**: Add new React components in `client/components/`
2. **API Routes**: Create new endpoints in `server/routes/`
3. **WebSocket Events**: Extend the WebSocket handler in `server/ws.js`
4. **Database**: Add new tables and queries in `server/db/`

### Code Style

- Use **ES6+** features
- Follow **React best practices**
- Use **Tailwind CSS** for styling
- Implement **proper error handling**

## 🚧 Roadmap

- [x] Real-time messaging with WebSockets
- [x] Message persistence in database
- [x] Connection status indicators
- [x] About modal with app information
- [ ] User authentication and authorization
- [ ] User profiles and avatars
- [ ] File/image sharing
- [ ] Message encryption
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Docker containerization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Texting! 💬**


