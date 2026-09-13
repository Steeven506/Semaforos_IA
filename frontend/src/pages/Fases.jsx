import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import faseService from '../services/faseService';
import semaforoService from '../services/semaforoService';
import Header from '../components/layout/Header';
import FaseList from '../components/fases/FaseList';
import FaseForm from '../components/fases/FaseForm';
import { Plus, Search, Filter } from 'lucide-react';

function Fases() {
  const { isAdmin, isOperador } = useAuth();
  const [fases, setFases] = useState([]);
  const [filteredFases, setFilteredFases] = useState([]);
  const [semaforos, setSemaforos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingFase, setEditingFase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemaforo, setFilterSemaforo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canEdit = isAdmin() || isOperador();
  const canDelete = isAdmin();

  const fetchData = async () => {
    try {
      const [fasesData, semaforosData] = await Promise.all([
        faseService.getAll(),
        semaforoService.getAll()
      ]);
      setFases(fasesData);
      setFilteredFases(fasesData);
      setSemaforos(semaforosData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = fases;

    if (searchTerm) {
      filtered = filtered.filter(f =>
        f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.semaforo_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSemaforo) {
      filtered = filtered.filter(f => f.semaforo_id === parseInt(filterSemaforo));
    }

    setFilteredFases(filtered);
  }, [searchTerm, filterSemaforo, fases]);

  const handleCreate = () => {
    setEditingFase(null);
    setShowForm(true);
  };

  const handleEdit = (fase) => {
    setEditingFase(fase);
    setShowForm(true);
  };

  const handleDelete = async (fase) => {
    if (!window.confirm(`Eliminar la fase "${fase.nombre}"?`)) {
      return;
    }

    try {
      await faseService.delete(fase.id);
      setSuccess('Fase eliminada exitosamente');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al eliminar');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError('');

    try {
      if (editingFase) {
        await faseService.update(editingFase.id, formData);
        setSuccess('Fase actualizada exitosamente');
      } else {
        await faseService.create(formData);
        setSuccess('Fase creada exitosamente');
      }

      setShowForm(false);
      setEditingFase(null);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400 text-xl">Cargando fases...</div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Fases" 
        subtitle={`${fases.length} fases registradas`}
      />

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              placeholder="Buscar fases..."
            />
          </div>

          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={filterSemaforo}
              onChange={(e) => setFilterSemaforo(e.target.value)}
              className="input-field pl-10"
            >
              <option value="">Todos los semaforos</option>
              {semaforos.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>

          {canEdit && (
            <button
              onClick={handleCreate}
              className="btn-success flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nueva Fase
            </button>
          )}
        </div>

        <FaseList
          fases={filteredFases}
          onEdit={handleEdit}
          onDelete={handleDelete}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </div>

      {showForm && (
        <FaseForm
          fase={editingFase}
          semaforos={semaforos}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingFase(null);
          }}
          loading={saving}
        />
      )}
    </div>
  );
}

export default Fases;