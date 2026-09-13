import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import semaforoService from '../services/semaforoService';
import intersectionService from '../services/intersectionService';
import Header from '../components/layout/Header';
import SemaforoList from '../components/semaforos/SemaforoList';
import SemaforoForm from '../components/semaforos/SemaforoForm';
import { Plus, Search, Filter } from 'lucide-react';

function Semaforos() {
  const { isAdmin, isOperador } = useAuth();
  const [semaforos, setSemaforos] = useState([]);
  const [filteredSemaforos, setFilteredSemaforos] = useState([]);
  const [intersections, setIntersections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSemaforo, setEditingSemaforo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIntersection, setFilterIntersection] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canEdit = isAdmin() || isOperador();
  const canDelete = isAdmin();

  const fetchData = async () => {
    try {
      const [semaforosData, intersectionsData] = await Promise.all([
        semaforoService.getAll(),
        intersectionService.getAll()
      ]);
      setSemaforos(semaforosData);
      setFilteredSemaforos(semaforosData);
      setIntersections(intersectionsData);
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
    let filtered = semaforos;

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.interseccion_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterIntersection) {
      filtered = filtered.filter(s => s.interseccion_id === parseInt(filterIntersection));
    }

    setFilteredSemaforos(filtered);
  }, [searchTerm, filterIntersection, semaforos]);

  const handleCreate = () => {
    setEditingSemaforo(null);
    setShowForm(true);
  };

  const handleEdit = (semaforo) => {
    setEditingSemaforo(semaforo);
    setShowForm(true);
  };

  const handleDelete = async (semaforo) => {
    if (!window.confirm(`Eliminar el semaforo "${semaforo.nombre}"?`)) {
      return;
    }

    try {
      await semaforoService.delete(semaforo.id);
      setSuccess('Semaforo eliminado exitosamente');
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
      if (editingSemaforo) {
        await semaforoService.update(editingSemaforo.id, formData);
        setSuccess('Semaforo actualizado exitosamente');
      } else {
        await semaforoService.create(formData);
        setSuccess('Semaforo creado exitosamente');
      }

      setShowForm(false);
      setEditingSemaforo(null);
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
        <div className="text-gray-400 text-xl">Cargando semaforos...</div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Semaforos" 
        subtitle={`${semaforos.length} semaforos registrados`}
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
              placeholder="Buscar semaforos..."
            />
          </div>

          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={filterIntersection}
              onChange={(e) => setFilterIntersection(e.target.value)}
              className="input-field pl-10"
            >
              <option value="">Todas las intersecciones</option>
              {intersections.map((i) => (
                <option key={i.id} value={i.id}>{i.nombre}</option>
              ))}
            </select>
          </div>

          {canEdit && (
            <button
              onClick={handleCreate}
              className="btn-success flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nuevo Semaforo
            </button>
          )}
        </div>

        <SemaforoList
          semaforos={filteredSemaforos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={(s) => console.log('Ver', s)}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </div>

      {showForm && (
        <SemaforoForm
          semaforo={editingSemaforo}
          intersections={intersections}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingSemaforo(null);
          }}
          loading={saving}
        />
      )}
    </div>
  );
}

export default Semaforos;