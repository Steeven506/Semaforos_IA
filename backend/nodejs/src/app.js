const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const intersectionRoutes = require('./routes/intersectionRoutes');
const semaforoRoutes = require('./routes/semaforoRoutes');
const faseRoutes = require('./routes/faseRoutes');
const cameraRoutes = require('./routes/cameraRoutes');
const emergenciaRoutes = require('./routes/emergenciaRoutes');
const detectionRoutes = require('./routes/detectionRoutes');
const grupoRoutes = require('./routes/grupoRoutes');
const iaRoutes = require('./routes/iaRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Traffic Intelligence System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      intersections: '/api/intersections',
      semaforos: '/api/semaforos',
      fases: '/api/fases',
      cameras: '/api/cameras',
      emergencias: '/api/emergencias',
      detections: '/api/detections',
      grupos: '/api/grupos',
      ia: '/api/ia'
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/intersections', intersectionRoutes);
app.use('/api/semaforos', semaforoRoutes);
app.use('/api/fases', faseRoutes);
app.use('/api/cameras', cameraRoutes);
app.use('/api/emergencias', emergenciaRoutes);
app.use('/api/detections', detectionRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/ia', iaRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;