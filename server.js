const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let activeTransmissions = [];

// --- ROUTES ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// --- SOCKET.IO REAL-TIME TRANSMISSIONS ---
io.on('connection', (socket) => {
    socket.emit('initTransmissions', activeTransmissions);

    // Push live clue or audio transmission from Admin Panel
    socket.on('pushTransmission', (data) => {
        const payload = {
            id: Date.now(),
            type: data.type || 'text', // 'text' or 'audio'
            sender: data.sender || 'INCOMING TRANSMISSION',
            message: data.message,
            audioUrl: data.audioUrl || '',
            time: new Date().toLocaleTimeString()
        };
        activeTransmissions.push(payload);
        io.emit('newTransmission', payload); // Auto-expand JARVIS panel on all client screens!
    });
});

server.listen(3000, '0.0.0.0', () => {
    console.log("⚡ CYPHERIX '26 Live Platform: http://localhost:3000");
    console.log("👑 Admin Transmission Deck: http://localhost:3000/admin");
});
