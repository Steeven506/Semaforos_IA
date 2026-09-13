import React from 'react';
import DetectionCard from './DetectionCard';

function DetectionList({ detections, onDelete, canDelete }) {
  if (detections.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-gray-500 text-lg">No hay detecciones registradas</p>
        <p className="text-gray-600 dark:text-gray-500 text-sm mt-2">
          Las detecciones apareceran aqui cuando el sistema detecte vehiculos
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {detections.map((detection) => (
        <DetectionCard
          key={detection.id}
          detection={detection}
          onDelete={onDelete}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
}

export default DetectionList;