import React from 'react';
import { Car, Users, Bike, Bus, Truck, Clock, Camera, MapPin, Trash2 } from 'lucide-react';

function DetectionCard({ detection, onDelete, canDelete }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Sin fecha';
    const date = new Date(timestamp);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTotalColor = (total) => {
    if (total >= 20) return 'text-red-400';
    if (total >= 10) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="glass-card p-5 hover:border-blue-500/50 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Camera className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {detection.camera_nombre || `Camara ${detection.camera_id}`}
            </h3>
            {detection.interseccion_nombre && (
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {detection.interseccion_nombre}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold ${getTotalColor(detection.total)}`}>
            {detection.total}
          </p>
          <p className="text-xs text-gray-500">vehiculos</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        <div className="text-center p-2 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
          <Users className="w-4 h-4 text-green-400 mx-auto mb-1" />
          <p className="text-sm font-bold text-gray-900 dark:text-white">{detection.personas || 0}</p>
          <p className="text-[10px] text-gray-500">Pers.</p>
        </div>
        <div className="text-center p-2 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
          <Car className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-sm font-bold text-gray-900 dark:text-white">{detection.carros || 0}</p>
          <p className="text-[10px] text-gray-500">Carros</p>
        </div>
        <div className="text-center p-2 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
          <Bike className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
          <p className="text-sm font-bold text-gray-900 dark:text-white">{detection.motos || 0}</p>
          <p className="text-[10px] text-gray-500">Motos</p>
        </div>
        <div className="text-center p-2 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
          <Bus className="w-4 h-4 text-red-400 mx-auto mb-1" />
          <p className="text-sm font-bold text-gray-900 dark:text-white">{detection.buses || 0}</p>
          <p className="text-[10px] text-gray-500">Buses</p>
        </div>
        <div className="text-center p-2 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
          <Truck className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
          <p className="text-sm font-bold text-gray-900 dark:text-white">{detection.camiones || 0}</p>
          <p className="text-[10px] text-gray-500">Cam.</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-dark-700">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDate(detection.timestamp)}
        </p>
        
        {canDelete && (
          <button
            onClick={() => onDelete(detection)}
            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            title="Eliminar"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export default DetectionCard;