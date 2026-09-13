import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import detectionService from '../services/detectionService';
import intersectionService from '../services/intersectionService';
import { connectSocket } from '../services/socket';
import Header from '../components/layout/Header';
import DetectionList from '../components/detections/DetectionList';
import {
  Search, Filter, Activity, Car, Users, Bike, Bus, Truck,
  RefreshCw, Calendar, Trash2
} from 'lucide-react';

function Detecciones() {
  const { isAdmin } = useAuth();
  const [detections, setDetections] = useState([]);
  const [filteredDetections, setFilteredDetections] = useState([]);
  const [intersections, setIntersections] = useState([]);
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIntersection, setFilterIntersection] = useState('');
  const [limit, setLimit] = useState(100);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canDelete = isAdmin();

  const fetchData = async () => {
    try {
      const [detectionsData, intersectionsData, statsData, summaryData] = await Promise.all([
        detectionService.getAll(limit),
        intersectionService.getAll(),
        detectionService.getTodayStats(),
        detectionService.getSummary()
      ]);
      setDetections(detectionsData);
      setFilteredDetections(detectionsData);
      setIntersections(intersectionsData);
      setStats(statsData);
      setSummary(summaryData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos');
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const [detectionsData, statsData, summaryData] = await Promise.all([
        detectionService.getAll(limit),
        detectionService.getTodayStats(),
        detectionService.getSummary()
      ]);
      setDetections(detectionsData);
      setFilteredDetections(detectionsData);
      setStats(statsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();

    const socket = connectSocket();
    socket.emit('join:global');

    socket.on('detection:new', (data) => {
      setDetections(prev => [data, ...prev].slice(0, limit));
      setSuccess('Nueva deteccion registrada');
      setTimeout(() => setSuccess(''), 2000);
    });

    socket.on('stats:update', (data) => {
      setStats(data);
    });

    return () => {
      socket.off('detection:new');
      socket.off('stats:update');
    };
  }, [limit]);

  useEffect(() => {
    let filtered = detections;

    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.camera_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.interseccion_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterIntersection) {
      filtered = filtered.filter(d => d.interseccion_id === parseInt(filterIntersection));
    }

    setFilteredDetections(filtered);
  }, [searchTerm, filterIntersection, detections]);

  const handleDelete = async (detection) => {
    if (!window.confirm(`Eliminar la deteccion #${detection.id}?`)) {
      return;
    }

    try {
      await detectionService.delete(detection.id);
      setSuccess('Deteccion eliminada exitosamente');
      setDetections(prev => prev.filter(d => d.id !== detection.id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al eliminar');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteOld = async () => {
    if (!window.confirm('Eliminar detecciones mayores a 30 dias?')) {
      return;
    }

    try {
      const result = await detectionService.deleteOld(30);
      setSuccess(`${result.total} detecciones eliminadas`);
      refreshData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al eliminar');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-xl">Cargando detecciones...</div>
      </div>
    );
  }

  const statCards = [
    { icon: Car, label: 'Vehiculos', value: stats?.total_vehiculos || 0, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Users, label: 'Personas', value: stats?.total_personas || 0, color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: Activity, label: 'Registros', value: stats?.total_registros || 0, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { icon: Calendar, label: 'Promedio/Min', value: Math.round(summary?.promedio_por_minuto || 0), color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div>
      <Header 
        title="Detecciones" 
        subtitle={`${detections.length} detecciones registradas`}
      />

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="glass-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{card.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${card.bg}`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Desglose por tipo de vehiculo (Hoy)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="text-center p-3 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
              <Car className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.total_carros || 0}</p>
              <p className="text-xs text-gray-500">Carros</p>
            </div>
            <div className="text-center p-3 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
              <Bike className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.total_motos || 0}</p>
              <p className="text-xs text-gray-500">Motos</p>
            </div>
            <div className="text-center p-3 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
              <Bus className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.total_buses || 0}</p>
              <p className="text-xs text-gray-500">Buses</p>
            </div>
            <div className="text-center p-3 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
              <Truck className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.total_camiones || 0}</p>
              <p className="text-xs text-gray-500">Camiones</p>
            </div>
            <div className="text-center p-3 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
              <Users className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.total_personas || 0}</p>
              <p className="text-xs text-gray-500">Personas</p>
            </div>
            <div className="text-center p-3 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
              <Activity className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900 dark:text-white">{summary?.maximo_por_minuto || 0}</p>
              <p className="text-xs text-gray-500">Max/Min</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              placeholder="Buscar por camara o interseccion..."
            />
          </div>

          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={filterIntersection}
              onChange={(e) => setFilterIntersection(e.target.value)}
              className="input-field pl-10"
            >
              <option value="">Todas las intersecciones</option>
              {intersections.map((i) => (
                <option key={i.id} value={i.id}>{i.nombre}</option>
              ))}
            </select>
          </div>

          <div className="relative min-w-[150px]">
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="input-field"
            >
              <option value="50">Ultimas 50</option>
              <option value="100">Ultimas 100</option>
              <option value="250">Ultimas 250</option>
              <option value="500">Ultimas 500</option>
            </select>
          </div>

          <button
            onClick={refreshData}
            disabled={refreshing}
            className={`btn-primary flex items-center gap-2 ${
              refreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </button>

          {canDelete && (
            <button
              onClick={handleDeleteOld}
              className="btn-danger flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Limpiar antiguas
            </button>
          )}
        </div>

        <DetectionList
          detections={filteredDetections}
          onDelete={handleDelete}
          canDelete={canDelete}
        />
      </div>
    </div>
  );
}

export default Detecciones;