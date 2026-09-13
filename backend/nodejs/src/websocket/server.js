const { Server } = require('socket.io');
const db = require('../config/database');

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
      console.log(`Cliente ${socket.id} unido a interseccion ${interseccion_id}`);
    });

    socket.on('leave:interseccion', (interseccion_id) => {
      socket.leave(`interseccion:${interseccion_id}`);
      console.log(`Cliente ${socket.id} salio de interseccion ${interseccion_id}`);
    });

    socket.on('join:global', () => {
      socket.join('global');
      console.log(`Cliente ${socket.id} unido a global`);
    });

    socket.on('request:stats', async (data) => {
      try {
        const { interseccion_id } = data;
        let query = `
          SELECT 
            COALESCE(SUM(personas), 0) as total_personas,
            COALESCE(SUM(carros), 0) as total_carros,
            COALESCE(SUM(motos), 0) as total_motos,
            COALESCE(SUM(buses), 0) as total_buses,
            COALESCE(SUM(camiones), 0) as total_camiones,
            COALESCE(SUM(total), 0) as total_vehiculos,
            COUNT(*) as total_registros
          FROM detections_log
          WHERE DATE(timestamp) = CURRENT_DATE
        `;

        const params = [];
        if (interseccion_id) {
          query += ` AND interseccion_id = $1`;
          params.push(interseccion_id);
        }

        const result = await db.query(query, params);
        socket.emit('stats:update', result.rows[0]);
      } catch (error) {
        console.error('Error en request:stats:', error);
        socket.emit('error', { message: error.message });
      }
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

  console.log('Evento detection:new emitido');
};

const emitNewEmergencia = (emergencia) => {
  if (!io) return;

  io.to('global').emit('emergencia:new', emergencia);

  if (emergencia.interseccion_id) {
    io.to(`interseccion:${emergencia.interseccion_id}`).emit('emergencia:new', emergencia);
  }

  console.log('Evento emergencia:new emitido');
};

const emitStatsUpdate = (stats, interseccion_id = null) => {
  if (!io) return;

  if (interseccion_id) {
    io.to(`interseccion:${interseccion_id}`).emit('stats:update', stats);
  } else {
    io.to('global').emit('stats:update', stats);
  }

  console.log('Evento stats:update emitido');
};

const emitSensorStatus = (sensor) => {
  if (!io) return;

  io.to('global').emit('sensor:status', sensor);

  if (sensor.interseccion_id) {
    io.to(`interseccion:${sensor.interseccion_id}`).emit('sensor:status', sensor);
  }

  console.log('Evento sensor:status emitido');
};

const emitCameraStatus = (camera) => {
  if (!io) return;

  io.to('global').emit('camera:status', camera);

  if (camera.interseccion_id) {
    io.to(`interseccion:${camera.interseccion_id}`).emit('camera:status', camera);
  }

  console.log('Evento camera:status emitido');
};

module.exports = {
  initializeWebSocket,
  emitNewDetection,
  emitNewEmergencia,
  emitStatsUpdate,
  emitSensorStatus,
  emitCameraStatus
};