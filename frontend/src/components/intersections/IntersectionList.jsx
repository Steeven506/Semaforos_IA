import React from 'react';
import IntersectionCard from './IntersectionCard';

function IntersectionList({ intersections, onEdit, onDelete, onView, canEdit, canDelete }) {
  if (intersections.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-gray-500 text-lg">No hay intersecciones registradas</p>
        <p className="text-gray-600 text-sm mt-2">Crea la primera interseccion para comenzar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {intersections.map((intersection) => (
        <IntersectionCard
          key={intersection.id}
          intersection={intersection}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
}

export default IntersectionList;