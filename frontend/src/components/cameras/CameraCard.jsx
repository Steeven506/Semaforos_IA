import React from 'react';
import { Camera, MapPin, Radio, Edit, Trash2, Link as LinkIcon, Wifi, Cable, Globe } from 'lucide-react';

function CameraCard({ camera, onEdit, onDelete, canEdit, canDelete }) {
  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'webcam':
        return <Cable className="w-6 h-6 text-blue-400" />;
      case 'wifi':
        return <Wifi className="w-6 h-6 text-green-400" />;
      case 'usb':
        return <Cable className="w-6 h-6 text-yellow-400" />;
      case 'ip':
        return <Globe className="w-6 h-6 text-purple-400" />;
      default:
        return <Camera className="w-6 h-6 text-gray-400" />;
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'webcam':
        return 'Webcam (PC)';
      case 'wifi':
        return 'WiFi (IP Webcam)';
      case 'usb':
        return 'USB (Celular)';
      case 'ip':
        return 'IP (RTSP/HTTP)';
      default:
        return tipo;
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'webcam':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/50';
      case 'wifi':
        return 'bg-green-500/20 text-green-400 border border-green-500/50';
      case 'usb':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50';
      case 'ip':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
    }
  };

  return (
    <div className="glass-card p-6 hover:border-purple-500/50 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10">
            {getTipoIcon(camera.camera_type)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{camera.name}</h3>
            <p className="text-sm text-gray-400">{getTipoLabel(camera.camera_type)}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTipoColor(camera.camera_type)}`}>
          {camera.camera_type.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {camera.interseccion_nombre && (
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {camera.interseccion_nombre}
          </p>
        )}
        {camera.sensor_nombre && (
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <Radio className="w-4 h-4" />
            {camera.sensor_nombre}
          </p>
        )}
        <p className="text-xs text-gray-500 flex items-center gap-2 break-all">
          <LinkIcon className="w-3 h-3 flex-shrink-0" />
          {camera.url}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-dark-700 mb-4">
        <span className="text-xs text-gray-500">Estado:</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          camera.activo 
            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
            : 'bg-red-500/20 text-red-400 border border-red-500/50'
        }`}>
          {camera.activo ? 'ACTIVA' : 'INACTIVA'}
        </span>
      </div>

      <div className="flex gap-2">
        {canEdit && (
          <button
            onClick={() => onEdit(camera)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
        )}
        
        {canDelete && (
          <button
            onClick={() => onDelete(camera)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default CameraCard;