import React from 'react';
import SemaforoCard from './SemaforoCard';

function SemaforoList({ semaforos, onEdit, onDelete, onView, canEdit, canDelete }) {
  if (semaforos.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-gray-500 text-lg">No hay semaforos registrados</p>
        <p className="text-gray-600 text-sm mt-2">Crea el primer semaforo para comenzar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {semaforos.map((semaforo) => (
        <SemaforoCard
          key={semaforo.id}
          semaforo={semaforo}
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

export default SemaforoList;