const http = require('http');
const app = require('./src/app');
const { initializeWebSocket } = require('./src/websocket/server');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initializeWebSocket(server);

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`WebSocket corriendo en ws://localhost:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV}`);
});