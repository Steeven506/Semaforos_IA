import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { connectSocket } from '../services/socket';
import Header from '../components/layout/Header';
import {
  Car,
  Users,
  Activity,
  TrendingUp,
  MapPin,
  AlertTriangle,
  Camera,
  Radio
} from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentDetections, setRecentDetections] = useState([]);
  const [emergenciasActivas, setEmergenciasActivas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, summaryRes, detectionsRes, emergenciasRes] = await Promise.all([
        api.get('/detections/stats/today'),
        api.get('/detections/stats/summary'),
        api.get('/detections?limit=5'),
        api.get('/emergencias/activas')
      ]);

      setStats(statsRes.data);
      setSummary(summaryRes.data);
      setRecentDetections(detectionsRes.data);
      setEmergenciasActivas(emergenciasRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const socket = connectSocket();
    
    socket.on('detection:new', (data) => {
      setRecentDetections(prev => [data, ...prev].slice(0, 5));
      fetchData();
    });

    socket.on('stats:update', (data) => {
      setStats(data);
    });

    socket.on('emergencia:new', (data) => {
      setEmergenciasActivas(prev => [data, ...prev]);
    });

    socket.emit('join:global');

    const interval = setInterval(fetchData, 30000);

    return () => {
      clearInterval(interval);
      socket.off('detection:new');
      socket.off('stats:update');
      socket.off('emergencia:new');
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400 text-xl">Cargando dashboard...</div>
      </div>
    );
  }

  const statCards = [
    { 
      icon: Car, 
      label: 'Total Vehiculos', 
      value: stats?.total_vehiculos || 0,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    { 
      icon: Users, 
      label: 'Personas', 
      value: stats?.total_personas || 0,
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    },
    { 
      icon: Activity, 
      label: 'Registros Hoy', 
      value: stats?.total_registros || 0,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10'
    },
    { 
      icon: TrendingUp, 
      label: 'Promedio/Minuto', 
      value: Math.round(summary?.promedio_por_minuto || 0),
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
  ];

  return (
    <div>
      <Header 
        title={`Bienvenido, ${user?.nombre}`} 
        subtitle="Panel de control del sistema de trafico"
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="glass-card p-6 hover:border-blue-500/50 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{card.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${card.bg}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Ultimas Detecciones
            </h3>
            {recentDetections.length > 0 ? (
              <div className="space-y-2">
                {recentDetections.map((detection, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                    <div>
                      <p className="text-sm text-white font-medium">
                        {detection.camera_nombre || `Camara ${detection.camera_id}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(detection.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-400">{detection.total}</p>
                      <p className="text-xs text-gray-500">vehiculos</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay detecciones recientes</p>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Emergencias Activas
            </h3>
            {emergenciasActivas.length > 0 ? (
              <div className="space-y-2">
                {emergenciasActivas.map((emergencia, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div>
                      <p className="text-sm text-white font-medium capitalize">
                        {emergencia.tipo}
                      </p>
                      <p className="text-xs text-gray-400">
                        {emergencia.descripcion || 'Sin descripcion'}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      ACTIVA
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay emergencias activas</p>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Resumen del Dia</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-dark-700/50 rounded-lg">
              <p className="text-2xl font-bold text-blue-400">{stats?.total_carros || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Carros</p>
            </div>
            <div className="text-center p-4 bg-dark-700/50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-400">{stats?.total_motos || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Motos</p>
            </div>
            <div className="text-center p-4 bg-dark-700/50 rounded-lg">
              <p className="text-2xl font-bold text-red-400">{stats?.total_buses || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Buses</p>
            </div>
            <div className="text-center p-4 bg-dark-700/50 rounded-lg">
              <p className="text-2xl font-bold text-cyan-400">{stats?.total_camiones || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Camiones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;