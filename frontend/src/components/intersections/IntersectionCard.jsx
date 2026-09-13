import React from 'react';
import { MapPin, TrafficCone, Camera, Edit, Trash2, Eye, Layers } from 'lucide-react';

function IntersectionCard({ intersection, onEdit, onDelete, onView, canEdit, canDelete }) {
  return (
    <div className="glass-card p-6 hover:border-blue-500/50 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10">
            <MapPin className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{intersection.nombre}</h3>
            <p className="text-sm text-gray-400">{intersection.descripcion || 'Sin descripcion'}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          intersection.activo
            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
            : 'bg-red-500/20 text-red-400 border border-red-500/50'
        }`}>
          {intersection.activo ? 'ACTIVA' : 'INACTIVA'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {intersection.direccion && (
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {intersection.direccion}
          </p>
        )}
        {intersection.ciudad && (
          <p className="text-sm text-gray-400">
            {intersection.ciudad}, {intersection.pais}
          </p>
        )}
        {intersection.latitud && intersection.longitud && (
          <p className="text-xs text-gray-500">
            Lat: {intersection.latitud}, Lng: {intersection.longitud}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t border-gray-200 dark:border-dark-700">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
            <TrafficCone className="w-4 h-4" />
            <span className="text-lg font-bold">{intersection.total_semaforos || 0}</span>
          </div>
          <p className="text-xs text-gray-500">Semaforos</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
            <Camera className="w-4 h-4" />
            <span className="text-lg font-bold">{intersection.total_camaras || 0}</span>
          </div>
          <p className="text-xs text-gray-500">Camaras</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
            <Layers className="w-4 h-4" />
            <span className="text-lg font-bold">{intersection.total_grupos || 0}</span>
          </div>
          <p className="text-xs text-gray-500">Grupos</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onView(intersection)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          Ver
        </button>

        {canEdit && (
          <button
            onClick={() => onEdit(intersection)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
        )}

        {canDelete && (
          <button
            onClick={() => onDelete(intersection)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default IntersectionCard;