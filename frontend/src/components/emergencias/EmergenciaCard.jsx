import React from 'react';
import { AlertTriangle, MapPin, Clock, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

function EmergenciaCard({ emergencia, onEdit, onDelete, onResolve, canEdit, canDelete }) {
  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'ambulancia':
        return '🚑';
      case 'bomberos':
        return '🚒';
      case 'policia':
        return '🚓';
      default:
        return '🚨';
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'ambulancia':
        return 'Ambulancia';
      case 'bomberos':
        return 'Bomberos';
      case 'policia':
        return 'Policia';
      default:
        return 'Otro';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activa':
        return 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse';
      case 'resuelta':
        return 'bg-green-500/20 text-green-400 border border-green-500/50';
      case 'cancelada':
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Sin fecha';
    const date = new Date(timestamp);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`glass-card p-6 transition ${
      emergencia.estado === 'activa' 
        ? 'border-red-500/50 shadow-lg shadow-red-500/10' 
        : 'hover:border-blue-500/50'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-red-500/10 text-2xl">
            {getTipoIcon(emergencia.tipo)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {getTipoLabel(emergencia.tipo)}
            </h3>
            <p className="text-xs text-gray-500">
              ID: #{emergencia.id}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getEstadoColor(emergencia.estado)}`}>
          {emergencia.estado}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {emergencia.descripcion && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {emergencia.descripcion}
          </p>
        )}
        {emergencia.interseccion_nombre && (
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {emergencia.interseccion_nombre}
            {emergencia.interseccion_ciudad && `, ${emergencia.interseccion_ciudad}`}
          </p>
        )}
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <Clock className="w-3 h-3" />
          {formatDate(emergencia.timestamp)}
        </p>
        {emergencia.resuelto_at && (
          <p className="text-xs text-green-500 flex items-center gap-2">
            <CheckCircle className="w-3 h-3" />
            Resuelto: {formatDate(emergencia.resuelto_at)}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        {emergencia.estado === 'activa' && canEdit && (
          <button
            onClick={() => onResolve(emergencia)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-medium"
          >
            <CheckCircle className="w-4 h-4" />
            Resolver
          </button>
        )}
        
        {canEdit && (
          <button
            onClick={() => onEdit(emergencia)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
        
        {canDelete && (
          <button
            onClick={() => onDelete(emergencia)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default EmergenciaCard;