import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import scrapRouter from './routes/scrapeRoutes.js';
import problemRouter from './routes/problemRoutes.js';
import solutionRouter from './routes/solutionRoutes.js';
import router from './routes/submissionRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const userSocketMap = {}; // Map socket.id -> username
const roomClients = {}; // Map roomId -> Set of socketIds
const messageHistory = {}; // Store message history for each room
const codeState = {}; // Store latest code state for each room
const whiteboardState = {}; // Store whiteboard state for each room

// WebSocket setup
const wss = new WebSocketServer({ noServer: true });




app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://firecodeblue.vercel.app",
        "https://firecode-blue.vercel.app",  // Old domain   
        "https://leetcode-backend-yizw.onrender.com",
    ],
    credentials: true,
}));


// WebSocket server logic
wss.on('connection', (ws, req) => {
  const { user, roomId } = req;

  if (!roomId) {
    ws.close();
    return;
  }

  console.log(`User ${user.id} connected to room ${roomId}`);

  // Initialize room if it doesn't exist
  if (!roomClients[roomId]) {
    roomClients[roomId] = new Set();
    messageHistory[roomId] = [];
    codeState[roomId] = '';
    whiteboardState[roomId] = []; // Initialize whiteboard state
  }

  roomClients[roomId].add(ws);
  userSocketMap[ws] = user.id;

  // Send initial data (code, messages, whiteboard) to newly connected user
  ws.send(JSON.stringify({
    type: 'INIT_DATA',
    messages: messageHistory[roomId],
    code: codeState[roomId],
    whiteboard: whiteboardState[roomId], // Send current whiteboard state
    userId: user.id
  }));

  // Notify others about new user
  broadcast(roomId, {
    type: 'USER_JOINED',
    userId: user.id,
    timestamp: new Date().toISOString()
  }, ws);

  // Handle incoming messages
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    switch (parsedMessage.type) {
      case 'CODE_CHANGE':
        // Handle code changes
        codeState[roomId] = parsedMessage.code;
        broadcast(roomId, {
          type: 'CODE_CHANGE',
          code: parsedMessage.code,
          userId: user.id,
          timestamp: new Date().toISOString()
        }, ws);
        break;

      case 'CHAT_MESSAGE':
        // Handle chat messages
        const messageData = {
          type: 'CHAT_MESSAGE',
          content: parsedMessage.content,
          userId: user.id,
          timestamp: new Date().toISOString()
        };
        messageHistory[roomId].push(messageData);
        broadcast(roomId, messageData, ws);
        break;

      case 'DRAW':
        // Handle whiteboard drawing
        const drawData = {
          type: 'DRAW',
          data: parsedMessage.data,
          userId: user.id,
          timestamp: new Date().toISOString()
        };
        whiteboardState[roomId].push(drawData);
        broadcast(roomId, drawData, ws);
        break;

      case 'CLEAR_WHITEBOARD':
        // Handle whiteboard clearing
        whiteboardState[roomId] = [];
        broadcast(roomId, {
          type: 'CLEAR_WHITEBOARD',
          userId: user.id,
          timestamp: new Date().toISOString()
        }, ws);
        break;

      case 'REQUEST_SYNC':
        // Send current room state (code, messages, whiteboard) to the requesting user
        ws.send(JSON.stringify({
          type: 'SYNC_RESPONSE',
          code: codeState[roomId],
          messages: messageHistory[roomId],
          whiteboard: whiteboardState[roomId]
        }));
        break;
    }
  });

  // Handle disconnections
  ws.on('close', () => {
    roomClients[roomId].delete(ws);
    broadcast(roomId, {
      type: 'USER_LEFT',
      userId: user.id,
      timestamp: new Date().toISOString()
    });
    delete userSocketMap[ws];

    // Clean up empty rooms
    if (roomClients[roomId].size === 0) {
      setTimeout(() => {
        if (roomClients[roomId]?.size === 0) {
          delete roomClients[roomId];
          delete messageHistory[roomId];
          delete codeState[roomId];
          delete whiteboardState[roomId]; // Cleanup whiteboard state
        }
      }, 3600000); // Clean up after 1 hour of inactivity
    }
  });
});

// Broadcast function to send a message to all users in a room except sender
function broadcast(roomId, message, senderWs = null) {
  roomClients[roomId]?.forEach(client => {
    if (client !== senderWs && client.readyState === 1) { // Check if client is open
      client.send(JSON.stringify(message));
    }
  });
}

// Express server setup
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});

connectDB();
// app.use(bodyParser.json());
// app.use(cors({
 
// }));

// WebSocket upgrade handling
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const token = url.searchParams.get('token');
  const roomId = url.searchParams.get('roomid');

  if (!token || !roomId) {
    socket.destroy();
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      socket.destroy();
      return;
    }
    request.user = decoded;
    request.roomId = roomId;

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
});

// Routes
app.use("/user", userRouter);
app.use("/solution", solutionRouter);
app.use("/leetcode", scrapRouter, problemRouter, router);

// API to create a room
app.post('/create-room', authMiddleware, (req, res) => {
  const roomId = uuidv4();
  const joinLink = `ws://${req.get('host')}/?roomid=${roomId}`;
  res.json({ roomId, joinLink });
});

// API for handling join-room logic
app.get('/join-room', authMiddleware, (req, res) => {
  const { roomId } = req.query;
  if (!roomClients[roomId]) {
    return res.status(404).json({ error: "Room not found" });
  }
  res.json({ message: "Room exists", roomId });
});
