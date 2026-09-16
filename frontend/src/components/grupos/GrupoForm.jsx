import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

function GrupoForm({ grupo, intersections, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    interseccion_id: '',
    nombre: '',
    descripcion: '',
    color_grupo: 'azul',
    direccion: 'Norte-Sur',
    tiempo_verde: 30,
    tiempo_amarillo: 5,
    tiempo_rojo: 25,
    offset_segundos: 0,
  });

  useEffect(() => {
    if (grupo) {
      setFormData({
        interseccion_id: grupo.interseccion_id || '',
        nombre: grupo.nombre || '',
        descripcion: grupo.descripcion || '',
        color_grupo: grupo.color_grupo || 'azul',
        direccion: grupo.direccion || 'Norte-Sur',
        tiempo_verde: grupo.tiempo_verde || 30,
        tiempo_amarillo: grupo.tiempo_amarillo || 5,
        tiempo_rojo: grupo.tiempo_rojo || 25,
        offset_segundos: grupo.offset_segundos || 0,
      });
    } else if (intersections.length > 0) {
      setFormData(prev => ({ ...prev, interseccion_id: intersections[0].id }));
    }
  }, [grupo, intersections]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      interseccion_id: parseInt(formData.interseccion_id),
      tiempo_verde: parseInt(formData.tiempo_verde),
      tiempo_amarillo: parseInt(formData.tiempo_amarillo),
      tiempo_rojo: parseInt(formData.tiempo_rojo),
      offset_segundos: parseInt(formData.offset_segundos),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div
        className="glass-card w-full max-w-2xl flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {grupo ? 'Editar Grupo' : 'Nuevo Grupo'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Interseccion *
            </label>
            <select
              name="interseccion_id"
              value={formData.interseccion_id}
              onChange={handleChange}
              className="input-field"
              required
              disabled={!!grupo}
            >
              <option value="">Selecciona una interseccion</option>
              {intersections.map((i) => (
                <option key={i.id} value={i.id}>{i.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Nombre del Grupo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="input-field"
              placeholder="Grupo Avenida"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Descripcion
            </label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="input-field"
              placeholder="Semaforos de la Av. Principal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Direccion *
              </label>
              <select
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Norte-Sur">Norte - Sur</option>
                <option value="Sur-Norte">Sur - Norte</option>
                <option value="Este-Oeste">Este - Oeste</option>
                <option value="Oeste-Este">Oeste - Este</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Color *
              </label>
              <select
                name="color_grupo"
                value={formData.color_grupo}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="azul">Azul</option>
                <option value="naranja">Naranja</option>
                <option value="verde">Verde</option>
                <option value="rojo">Rojo</option>
                <option value="purpura">Purpura</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-dark-700 pt-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Tiempos de Fase (segundos)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-green-500 mb-2">
                  Verde
                </label>
                <input
                  type="number"
                  name="tiempo_verde"
                  value={formData.tiempo_verde}
                  onChange={handleChange}
                  className="input-field"
                  min="5"
                  max="120"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-yellow-500 mb-2">
                  Amarillo
                </label>
                <input
                  type="number"
                  name="tiempo_amarillo"
                  value={formData.tiempo_amarillo}
                  onChange={handleChange}
                  className="input-field"
                  min="2"
                  max="15"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-red-500 mb-2">
                  Rojo
                </label>
                <input
                  type="number"
                  name="tiempo_rojo"
                  value={formData.tiempo_rojo}
                  onChange={handleChange}
                  className="input-field"
                  min="5"
                  max="120"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Offset (segundos)
            </label>
            <input
              type="number"
              name="offset_segundos"
              value={formData.offset_segundos}
              onChange={handleChange}
              className="input-field"
              min="0"
              max="120"
            />
            <p className="text-xs text-gray-500 mt-1">
              Desfase con respecto al grupo principal (usalo para grupos opuestos)
            </p>
          </div>
        </form>

        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-dark-700 flex-shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 text-gray-900 dark:text-white rounded-lg transition font-medium"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GrupoForm;