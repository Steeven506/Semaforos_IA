import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import grupoService from '../../services/grupoService';
import {
  Layers, MapPin, Edit, Trash2, ArrowRight,
  Play, Pause, Clock, Zap, CheckCircle
} from 'lucide-react';

function GrupoCard({ grupo, onEdit, onDelete, onUpdate, canEdit, canDelete }) {
  const { isAdmin } = useAuth();
  const [changing, setChanging] = useState(false);
  const [success, setSuccess] = useState('');

  const getColorStyle = (color) => {
    const colors = {
      azul: 'bg-blue-500/20 text-blue-400 border border-blue-500/50',
      naranja: 'bg-orange-500/20 text-orange-400 border border-orange-500/50',
      verde: 'bg-green-500/20 text-green-400 border border-green-500/50',
      rojo: 'bg-red-500/20 text-red-400 border border-red-500/50',
      purpura: 'bg-purple-500/20 text-purple-400 border border-purple-500/50',
    };
    return colors[color] || 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
  };

  const getColorDot = (color) => {
    const colors = {
      azul: 'bg-blue-500',
      naranja: 'bg-orange-500',
      verde: 'bg-green-500',
      rojo: 'bg-red-500',
      purpura: 'bg-purple-500',
    };
    return colors[color] || 'bg-gray-500';
  };

  const getEstadoColor = (estado) => {
    const colors = {
      verde: 'text-green-400',
      amarillo: 'text-yellow-400',
      rojo: 'text-red-400',
    };
    return colors[estado] || 'text-gray-400';
  };

  const getEstadoDot = (estado) => {
    const colors = {
      verde: 'bg-green-500 animate-pulse',
      amarillo: 'bg-yellow-500 animate-pulse',
      rojo: 'bg-red-500 animate-pulse',
    };
    return colors[estado] || 'bg-gray-500';
  };

  const handleCambiarEstado = async (estado) => {
    setChanging(true);
    try {
      await grupoService.cambiarEstado(grupo.id, estado);
      setSuccess(`Estado cambiado a ${estado}`);
      if (onUpdate) onUpdate();
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      console.error('Error:', error);
    }
    setChanging(false);
  };

  const handleModoAutomatico = async () => {
    setChanging(true);
    try {
      await grupoService.activarModoAutomatico(grupo.id);
      setSuccess('Modo automatico activado');
      if (onUpdate) onUpdate();
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      console.error('Error:', error);
    }
    setChanging(false);
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

      <div className="p-4 bg-gray-100 dark:bg-dark-700/50 rounded-lg mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 uppercase font-bold">Estado Actual</span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getEstadoDot(grupo.estado_actual || 'verde')}`}></div>
            <span className={`text-sm font-bold uppercase ${getEstadoColor(grupo.estado_actual || 'verde')}`}>
              {grupo.estado_actual || 'verde'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {grupo.modo_automatico ? (
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Automatico
            </span>
          ) : (
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full flex items-center gap-1">
              <Pause className="w-3 h-3" />
              Manual
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
          <p className="text-xs text-green-400 font-bold">VERDE</p>
          <p className="text-lg font-bold text-green-400">{grupo.tiempo_verde || 30}s</p>
        </div>
        <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
          <p className="text-xs text-yellow-400 font-bold">AMARILLO</p>
          <p className="text-lg font-bold text-yellow-400">{grupo.tiempo_amarillo || 5}s</p>
        </div>
        <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
          <p className="text-xs text-red-400 font-bold">ROJO</p>
          <p className="text-lg font-bold text-red-400">{grupo.tiempo_rojo || 25}s</p>
        </div>
      </div>

      {isAdmin() && (
        <div className="space-y-2 mb-4">
          <p className="text-xs text-gray-500 uppercase font-bold">Cambiar Estado</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleCambiarEstado('verde')}
              disabled={changing}
              className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
            >
              Verde
            </button>
            <button
              onClick={() => handleCambiarEstado('amarillo')}
              disabled={changing}
              className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
            >
              Amarillo
            </button>
            <button
              onClick={() => handleCambiarEstado('rojo')}
              disabled={changing}
              className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
            >
              Rojo
            </button>
          </div>

          {!grupo.modo_automatico && (
            <button
              onClick={handleModoAutomatico}
              disabled={changing}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Play className="w-3 h-3" />
              Activar Modo Automatico
            </button>
          )}
        </div>
      )}

      {success && (
        <div className="mb-4 p-2 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-green-400" />
          <span className="text-xs text-green-400">{success}</span>
        </div>
      )}

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