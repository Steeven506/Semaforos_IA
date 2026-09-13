import React from 'react';
import FaseCard from './FaseCard';

function FaseList({ fases, onEdit, onDelete, canEdit, canDelete }) {
  if (fases.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-gray-500 text-lg">No hay fases registradas</p>
        <p className="text-gray-600 text-sm mt-2">Crea la primera fase para comenzar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {fases.map((fase) => (
        <FaseCard
          key={fase.id}
          fase={fase}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
}

export default FaseList;