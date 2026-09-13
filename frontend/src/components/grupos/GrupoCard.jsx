import React from 'react';
import { Layers, MapPin, Palette, Edit, Trash2, ArrowRight } from 'lucide-react';

function GrupoCard({ grupo, onEdit, onDelete, canEdit, canDelete }) {
  const getColorStyle = (color) => {
    switch (color) {
      case 'azul':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/50';
      case 'naranja':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/50';
      case 'verde':
        return 'bg-green-500/20 text-green-400 border border-green-500/50';
      case 'rojo':
        return 'bg-red-500/20 text-red-400 border border-red-500/50';
      case 'purpura':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
    }
  };

  const getColorDot = (color) => {
    switch (color) {
      case 'azul':
        return 'bg-blue-500';
      case 'naranja':
        return 'bg-orange-500';
      case 'verde':
        return 'bg-green-500';
      case 'rojo':
        return 'bg-red-500';
      case 'purpura':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="glass-card p-6 hover:border-purple-500/50 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`w-4 h-4 rounded-full mt-1.5 ${getColorDot(grupo.color_grupo)}`}></div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{grupo.nombre}</h3>
            <p className="text-sm text-gray-400">{grupo.descripcion || 'Sin descripcion'}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getColorStyle(grupo.color_grupo)}`}>
          {grupo.color_grupo}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {grupo.interseccion_nombre && (
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {grupo.interseccion_nombre}
          </p>
        )}
        {grupo.direccion && (
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            {grupo.direccion}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4 pt-4 border-t border-gray-200 dark:border-dark-700">
        <Layers className="w-4 h-4 text-purple-400" />
        <span className="text-sm text-gray-400">Semaforos:</span>
        <span className="text-lg font-bold text-purple-400">{grupo.total_semaforos || 0}</span>
      </div>

      <div className="flex gap-2">
        {canEdit && (
          <button
            onClick={() => onEdit(grupo)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
        )}

        {canDelete && (
          <button
            onClick={() => onDelete(grupo)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default GrupoCard;