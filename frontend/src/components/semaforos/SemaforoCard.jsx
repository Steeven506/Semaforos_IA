import React from 'react';
import { TrafficCone, MapPin, Edit, Trash2, Eye, Clock } from 'lucide-react';

function SemaforoCard({ semaforo, onEdit, onDelete, onView, canEdit, canDelete }) {
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-500/20 text-green-400 border border-green-500/50';
      case 'mantenimiento':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50';
      case 'inactivo':
        return 'bg-red-500/20 text-red-400 border border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'vehicular':
        return '🚗';
      case 'peatonal':
        return '🚶';
      default:
        return '🚦';
    }
  };

  return (
    <div className="glass-card p-6 hover:border-yellow-500/50 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-yellow-500/10 text-2xl">
            {getTipoIcon(semaforo.tipo)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{semaforo.nombre}</h3>
            <p className="text-sm text-gray-400 capitalize">{semaforo.tipo}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getEstadoColor(semaforo.estado)}`}>
          {semaforo.estado}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {semaforo.interseccion_nombre && (
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {semaforo.interseccion_nombre}
          </p>
        )}
        {semaforo.latitud && semaforo.longitud && (
          <p className="text-xs text-gray-500">
            Lat: {semaforo.latitud}, Lng: {semaforo.longitud}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4 pt-4 border-t border-dark-700">
        <Clock className="w-4 h-4 text-blue-400" />
        <span className="text-sm text-gray-400">Fases configuradas:</span>
        <span className="text-lg font-bold text-blue-400">{semaforo.total_fases || 0}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onView(semaforo)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          Ver
        </button>
        
        {canEdit && (
          <button
            onClick={() => onEdit(semaforo)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
        )}
        
        {canDelete && (
          <button
            onClick={() => onDelete(semaforo)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SemaforoCard;