import React, { useState, useEffect } from 'react';
import intersectionService from '../services/intersectionService';
import semaforoService from '../services/semaforoService';
import cameraService from '../services/cameraService';
import emergenciaService from '../services/emergenciaService';
import Header from '../components/layout/Header';
import InteractiveMap from '../components/map/InteractiveMap';
import { MapPin, TrafficCone, Camera, AlertTriangle, Layers, RefreshCw } from 'lucide-react';

function Mapa() {
  const [intersections, setIntersections] = useState([]);
  const [semaforos, setSemaforos] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [emergencias, setEmergencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIntersection, setSelectedIntersection] = useState(null);
  const [error, setError] = useState('');

  const [showLayers, setShowLayers] = useState({
    intersections: true,
    semaforos: true,
    cameras: true,
    emergencias: true,
  });

  const fetchData = async () => {
    try {
      const [intersectionsData, semaforosData, camerasData, emergenciasData] = await Promise.all([
        intersectionService.getAll(),
        semaforoService.getAll(),
        cameraService.getAll(),
        emergenciaService.getActivas()
      ]);

      setIntersections(intersectionsData);
      setSemaforos(semaforosData);
      setCameras(camerasData);
      setEmergencias(emergenciasData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos del mapa');
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleLayer = (layer) => {
    setShowLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleIntersectionClick = (intersection) => {
    setSelectedIntersection(intersection);
  };

  const clearSelection = () => {
    setSelectedIntersection(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-xl">Cargando mapa...</div>
      </div>
    );
  }

  const layers = [
    { key: 'intersections', label: 'Intersecciones', icon: MapPin, count: intersections.length, color: 'text-blue-400' },
    { key: 'semaforos', label: 'Semaforos', icon: TrafficCone, count: semaforos.length, color: 'text-yellow-400' },
    { key: 'cameras', label: 'Camaras', icon: Camera, count: cameras.length, color: 'text-purple-400' },
    { key: 'emergencias', label: 'Emergencias', icon: AlertTriangle, count: emergencias.length, color: 'text-red-400' },
  ];

  return (
    <div>
      <Header
        title="Mapa Interactivo"
        subtitle="Ocana, Norte de Santander - Visualizacion geografica"
      />

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Layers className="w-4 h-4" />
            <span className="font-medium">Capas:</span>
          </div>

          {layers.map((layer) => {
            const Icon = layer.icon;
            return (
              <button
                key={layer.key}
                onClick={() => toggleLayer(layer.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  showLayers[layer.key]
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-dark-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon className={`w-4 h-4 ${showLayers[layer.key] ? '' : layer.color}`} />
                {layer.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  showLayers[layer.key] ? 'bg-white/20' : 'bg-gray-300 dark:bg-dark-600'
                }`}>
                  {layer.count}
                </span>
              </button>
            );
          })}

          <button
            onClick={refreshData}
            disabled={refreshing}
            className={`ml-auto btn-primary flex items-center gap-2 ${
              refreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        {selectedIntersection && (
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {selectedIntersection.nombre}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedIntersection.ciudad}, {selectedIntersection.pais}
                </p>
              </div>
            </div>
            <button
              onClick={clearSelection}
              className="px-4 py-2 bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 text-gray-900 dark:text-white rounded-lg transition text-sm font-medium"
            >
              Ver todo el mapa
            </button>
          </div>
        )}

        <InteractiveMap
          intersections={intersections}
          semaforos={semaforos}
          cameras={cameras}
          emergencias={emergencias}
          selectedIntersection={selectedIntersection}
          onIntersectionClick={handleIntersectionClick}
          showIntersections={showLayers.intersections}
          showSemaforos={showLayers.semaforos}
          showCameras={showLayers.cameras}
          showEmergencias={showLayers.emergencias}
          height="600px"
        />

        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Leyenda
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Interseccion</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Semaforo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Camara</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Emergencia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mapa;