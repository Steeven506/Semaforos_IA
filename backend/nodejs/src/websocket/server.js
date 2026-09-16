const { Server } = require('socket.io');

let io = null;

const initializeWebSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on('join:interseccion', (interseccion_id) => {
      socket.join(`interseccion:${interseccion_id}`);
    });

    socket.on('leave:interseccion', (interseccion_id) => {
      socket.leave(`interseccion:${interseccion_id}`);
    });

    socket.on('join:global', () => {
      socket.join('global');
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  console.log('WebSocket inicializado');
  return io;
};

const emitNewDetection = (detection) => {
  if (!io) return;
  io.to('global').emit('detection:new', detection);
  if (detection.interseccion_id) {
    io.to(`interseccion:${detection.interseccion_id}`).emit('detection:new', detection);
  }
};

const emitNewEmergencia = (emergencia) => {
  if (!io) return;
  io.to('global').emit('emergencia:new', emergencia);
  if (emergencia.interseccion_id) {
    io.to(`interseccion:${emergencia.interseccion_id}`).emit('emergencia:new', emergencia);
  }
};

const emitStatsUpdate = (stats, interseccion_id = null) => {
  if (!io) return;
  if (interseccion_id) {
    io.to(`interseccion:${interseccion_id}`).emit('stats:update', stats);
  } else {
    io.to('global').emit('stats:update', stats);
  }
};

const emitSemaforoCambio = (data) => {
  if (!io) return;
  io.to('global').emit('semaforo:cambio', data);
  if (data.interseccion_id) {
    io.to(`interseccion:${data.interseccion_id}`).emit('semaforo:cambio', data);
  }
  console.log('Evento semaforo:cambio emitido');
};

const emitDecisionIA = (decision) => {
  if (!io) return;
  io.to('global').emit('ia:decision', decision);
  if (decision.interseccion_id) {
    io.to(`interseccion:${decision.interseccion_id}`).emit('ia:decision', decision);
  }
  console.log('Evento ia:decision emitido');
};

module.exports = {
  initializeWebSocket,
  emitNewDetection,
  emitNewEmergencia,
  emitStatsUpdate,
  emitSemaforoCambio,
  emitDecisionIA
};