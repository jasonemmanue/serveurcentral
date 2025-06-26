const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // IMPORTANT: Pour la production, remplacez "*" par l'URL de votre client JavaFX si possible, ou gardez "*" si la sécurité n'est pas une préoccupation majeure au début.
    methods: ["GET", "POST"]
  }
});

const userSockets = {}; // { "userId": "socketId" }

io.on('connection', (socket) => {
  console.log(`Un utilisateur s'est connecté: ${socket.id}`);

  socket.on('register', (userId) => {
    userSockets[userId] = socket.id;
    socket.userId = userId;
    io.emit('online-users', Object.keys(userSockets));
  });

  socket.on('webrtc-offer', ({ toUserId, sdp }) => {
    const targetSocketId = userSockets[toUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit('webrtc-offer', { sdp, fromUserId: socket.userId });
    }
  });

  socket.on('webrtc-answer', ({ toUserId, sdp }) => {
    const targetSocketId = userSockets[toUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit('webrtc-answer', { sdp, fromUserId: socket.userId });
    }
  });

  socket.on('webrtc-ice-candidate', ({ toUserId, candidate }) => {
    const targetSocketId = userSockets[toUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit('webrtc-ice-candidate', { candidate, fromUserId: socket.userId });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Utilisateur déconnecté: ${socket.id}`);
    if (socket.userId) {
      delete userSockets[socket.userId];
      io.emit('online-users', Object.keys(userSockets));
    }
  });
});

const PORT = process.env.PORT || 10000; // Render fournira la variable PORT
server.listen(PORT, () => console.log(`Serveur de signalisation écoute sur le port ${PORT}`));