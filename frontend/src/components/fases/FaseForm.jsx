import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

function FaseForm({ fase, semaforos, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    semaforo_id: '',
    nombre: '',
    duracion: 30,
    orden: 1,
    color: 'verde',
  });

  useEffect(() => {
    if (fase) {
      setFormData({
        semaforo_id: fase.semaforo_id || '',
        nombre: fase.nombre || '',
        duracion: fase.duracion || 30,
        orden: fase.orden || 1,
        color: fase.color || 'verde',
      });
    } else if (semaforos.length > 0) {
      setFormData(prev => ({ ...prev, semaforo_id: semaforos[0].id }));
    }
  }, [fase, semaforos]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      semaforo_id: parseInt(formData.semaforo_id),
      duracion: parseInt(formData.duracion),
      orden: parseInt(formData.orden),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-bold text-white">
            {fase ? 'Editar Fase' : 'Nueva Fase'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-dark-700 rounded-lg transition text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Semaforo *
            </label>
            <select
              name="semaforo_id"
              value={formData.semaforo_id}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Selecciona un semaforo</option>
              {semaforos.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="input-field"
              placeholder="Verde Parque Principal"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Duracion (segundos) *
              </label>
              <input
                type="number"
                min="1"
                max="300"
                name="duracion"
                value={formData.duracion}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Orden *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                name="orden"
                value={formData.orden}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Color *
              </label>
              <select
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="verde">Verde</option>
                <option value="amarillo">Amarillo</option>
                <option value="rojo">Rojo</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
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
        </form>
      </div>
    </div>
  );
}

export default FaseForm;