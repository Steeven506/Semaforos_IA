import React from 'react';
import { Clock, Edit, Trash2, Hash } from 'lucide-react';

function FaseCard({ fase, onEdit, onDelete, canEdit, canDelete }) {
  const getColorStyle = (color) => {
    switch (color) {
      case 'verde':
        return 'bg-green-500/20 text-green-400 border border-green-500/50';
      case 'amarillo':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50';
      case 'rojo':
        return 'bg-red-500/20 text-red-400 border border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
    }
  };

  const getColorDot = (color) => {
    switch (color) {
      case 'verde':
        return 'bg-green-500';
      case 'amarillo':
        return 'bg-yellow-500';
      case 'rojo':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="glass-card p-5 hover:border-blue-500/50 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`w-4 h-4 rounded-full mt-1.5 ${getColorDot(fase.color)}`}></div>
          <div>
            <h3 className="text-lg font-bold text-white">{fase.nombre}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <Hash className="w-3 h-3" />
              Orden: {fase.orden}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getColorStyle(fase.color)}`}>
          {fase.color}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {fase.semaforo_nombre && (
          <p className="text-sm text-gray-400">
            Semaforo: <span className="text-white font-medium">{fase.semaforo_nombre}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4 pt-4 border-t border-dark-700">
        <Clock className="w-5 h-5 text-blue-400" />
        <span className="text-sm text-gray-400">Duracion:</span>
        <span className="text-2xl font-bold text-blue-400">{fase.duracion}s</span>
      </div>

      <div className="flex gap-2">
        {canEdit && (
          <button
            onClick={() => onEdit(fase)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
        )}
        
        {canDelete && (
          <button
            onClick={() => onDelete(fase)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default FaseCard;