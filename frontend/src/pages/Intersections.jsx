import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import intersectionService from '../services/intersectionService';
import Header from '../components/layout/Header';
import IntersectionList from '../components/intersections/IntersectionList';
import IntersectionForm from '../components/intersections/IntersectionForm';
import IntersectionDetail from '../components/intersections/IntersectionDetail';
import { Plus, Search } from 'lucide-react';

function Intersections() {
  const { isAdmin, isOperador } = useAuth();
  const [intersections, setIntersections] = useState([]);
  const [filteredIntersections, setFilteredIntersections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedIntersection, setSelectedIntersection] = useState(null);
  const [editingIntersection, setEditingIntersection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canEdit = isAdmin() || isOperador();
  const canDelete = isAdmin();

  const fetchIntersections = async () => {
    try {
      const data = await intersectionService.getAll();
      setIntersections(data);
      setFilteredIntersections(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching intersections:', error);
      setError('Error al cargar las intersecciones');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntersections();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = intersections.filter(i =>
        i.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.direccion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredIntersections(filtered);
    } else {
      setFilteredIntersections(intersections);
    }
  }, [searchTerm, intersections]);

  const handleCreate = () => {
    setEditingIntersection(null);
    setShowForm(true);
  };

  const handleEdit = (intersection) => {
    setEditingIntersection(intersection);
    setShowForm(true);
  };

  const handleView = (intersection) => {
    setSelectedIntersection(intersection);
    setShowDetail(true);
  };

  const handleDelete = async (intersection) => {
    if (!window.confirm(`Eliminar la interseccion "${intersection.nombre}"?`)) {
      return;
    }

    try {
      await intersectionService.delete(intersection.id);
      setSuccess('Interseccion eliminada exitosamente');
      fetchIntersections();
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
      if (editingIntersection) {
        await intersectionService.update(editingIntersection.id, formData);
        setSuccess('Interseccion actualizada exitosamente');
      } else {
        await intersectionService.create(formData);
        setSuccess('Interseccion creada exitosamente');
      }

      setShowForm(false);
      setEditingIntersection(null);
      fetchIntersections();
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
        <div className="text-gray-400 text-xl">Cargando intersecciones...</div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Intersecciones" 
        subtitle={`${intersections.length} intersecciones registradas`}
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

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              placeholder="Buscar intersecciones..."
            />
          </div>

          {canEdit && (
            <button
              onClick={handleCreate}
              className="btn-success flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nueva Interseccion
            </button>
          )}
        </div>

        <IntersectionList
          intersections={filteredIntersections}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </div>

      {showForm && (
        <IntersectionForm
          intersection={editingIntersection}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingIntersection(null);
          }}
          loading={saving}
        />
      )}

      {showDetail && selectedIntersection && (
        <IntersectionDetail
          intersection={selectedIntersection}
          onClose={() => {
            setShowDetail(false);
            setSelectedIntersection(null);
          }}
        />
      )}
    </div>
  );
}

export default Intersections;