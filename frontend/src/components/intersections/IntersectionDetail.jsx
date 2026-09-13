import React, { useState, useEffect } from 'react';
import { X, MapPin, TrafficCone, Camera, AlertTriangle, Activity, Layers } from 'lucide-react';
import intersectionService from '../../services/intersectionService';

function IntersectionDetail({ intersection, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await intersectionService.getStats(intersection.id);
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [intersection.id]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <MapPin className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{intersection.nombre}</h2>
              <p className="text-sm text-gray-400">
                {intersection.ciudad}, {intersection.pais}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Descripcion</p>
              <p className="text-sm text-gray-900 dark:text-white">{intersection.descripcion || 'Sin descripcion'}</p>
            </div>
            <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Direccion</p>
              <p className="text-sm text-gray-900 dark:text-white">{intersection.direccion || 'Sin direccion'}</p>
            </div>
            <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Coordenadas</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {intersection.latitud && intersection.longitud
                  ? `${intersection.latitud}, ${intersection.longitud}`
                  : 'Sin coordenadas'}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Estado</p>
              <p className={`text-sm font-bold ${intersection.activo ? 'text-green-400' : 'text-red-400'}`}>
                {intersection.activo ? 'ACTIVA' : 'INACTIVA'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estadisticas</h3>
            {loading ? (
              <p className="text-gray-500 text-center py-4">Cargando estadisticas...</p>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg text-center">
                  <TrafficCone className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_semaforos || 0}</p>
                  <p className="text-xs text-gray-500">Semaforos</p>
                </div>
                <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg text-center">
                  <Camera className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_camaras || 0}</p>
                  <p className="text-xs text-gray-500">Camaras</p>
                </div>
                <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg text-center">
                  <Layers className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_grupos || 0}</p>
                  <p className="text-xs text-gray-500">Grupos</p>
                </div>
                <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg text-center">
                  <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.emergencias_activas || 0}</p>
                  <p className="text-xs text-gray-500">Emergencias</p>
                </div>
                <div className="bg-gray-100 dark:bg-dark-700/50 p-4 rounded-lg text-center">
                  <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_detecciones_hoy || 0}</p>
                  <p className="text-xs text-gray-500">Detecciones Hoy</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay estadisticas disponibles</p>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-dark-700">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 text-gray-900 dark:text-white rounded-lg transition font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntersectionDetail;