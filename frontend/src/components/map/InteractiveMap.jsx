import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, TrafficCone, Camera, AlertTriangle } from 'lucide-react';

const OCANA_CENTER = [8.2377, -73.3560];

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function createMarkerIcon(type, isEmergency = false) {
  const className = isEmergency ? 'emergencia' : type;

  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-pin ${className}"></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
}

function InteractiveMap({
  intersections = [],
  semaforos = [],
  cameras = [],
  emergencias = [],
  selectedIntersection = null,
  onIntersectionClick = null,
  showIntersections = true,
  showSemaforos = true,
  showCameras = true,
  showEmergencias = true,
  height = '600px'
}) {
  const center = selectedIntersection
    ? [parseFloat(selectedIntersection.latitud), parseFloat(selectedIntersection.longitud)]
    : OCANA_CENTER;

  const zoom = selectedIntersection ? 16 : 14;

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <ChangeView center={center} zoom={zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showIntersections && intersections.map((intersection) => {
          if (!intersection.latitud || !intersection.longitud) return null;

          return (
            <Marker
              key={`intersection-${intersection.id}`}
              position={[parseFloat(intersection.latitud), parseFloat(intersection.longitud)]}
              icon={createMarkerIcon('intersection')}
              eventHandlers={{
                click: () => onIntersectionClick && onIntersectionClick(intersection),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {intersection.nombre}
                    </h3>
                  </div>
                  {intersection.descripcion && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {intersection.descripcion}
                    </p>
                  )}
                  {intersection.direccion && (
                    <p className="text-xs text-gray-500 mb-1">
                      {intersection.direccion}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mb-2">
                    {intersection.ciudad}, {intersection.pais}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-dark-700">
                    <div className="text-center">
                      <p className="text-xs font-bold text-yellow-500">
                        {intersection.total_semaforos || 0}
                      </p>
                      <p className="text-[10px] text-gray-500">Semaforos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-purple-500">
                        {intersection.total_camaras || 0}
                      </p>
                      <p className="text-[10px] text-gray-500">Camaras</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-red-500">
                        {intersection.total_emergencias || 0}
                      </p>
                      <p className="text-[10px] text-gray-500">Emergencias</p>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {showSemaforos && semaforos.map((semaforo) => {
          if (!semaforo.latitud || !semaforo.longitud) return null;

          return (
            <Marker
              key={`semaforo-${semaforo.id}`}
              position={[parseFloat(semaforo.latitud), parseFloat(semaforo.longitud)]}
              icon={createMarkerIcon('semaforo')}
            >
              <Popup>
                <div className="p-2 min-w-[180px]">
                  <div className="flex items-center gap-2 mb-2">
                    <TrafficCone className="w-4 h-4 text-yellow-500" />
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {semaforo.nombre}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 capitalize mb-1">
                    Tipo: {semaforo.tipo}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    Estado: <span className={`font-bold ${
                      semaforo.estado === 'activo' ? 'text-green-500' :
                      semaforo.estado === 'mantenimiento' ? 'text-yellow-500' : 'text-red-500'
                    }`}>{semaforo.estado}</span>
                  </p>
                  {semaforo.interseccion_nombre && (
                    <p className="text-xs text-gray-500">
                      {semaforo.interseccion_nombre}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {showCameras && cameras.map((camera) => {
          if (!camera.latitud || !camera.longitud) return null;

          return (
            <Marker
              key={`camera-${camera.id}`}
              position={[parseFloat(camera.latitud), parseFloat(camera.longitud)]}
              icon={createMarkerIcon('camera')}
            >
              <Popup>
                <div className="p-2 min-w-[180px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-purple-500" />
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {camera.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 capitalize mb-1">
                    Tipo: {camera.camera_type}
                  </p>
                  <p className="text-xs text-gray-500 break-all">
                    {camera.url}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {showEmergencias && emergencias.map((emergencia) => {
          if (!emergencia.latitud || !emergencia.longitud) return null;

          return (
            <Marker
              key={`emergencia-${emergencia.id}`}
              position={[parseFloat(emergencia.latitud), parseFloat(emergencia.longitud)]}
              icon={createMarkerIcon('emergencia', true)}
            >
              <Popup>
                <div className="p-2 min-w-[180px]">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <h3 className="font-bold text-red-600 dark:text-red-400 uppercase">
                      {emergencia.tipo}
                    </h3>
                  </div>
                  {emergencia.descripcion && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {emergencia.descripcion}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Estado: <span className="font-bold text-red-500">{emergencia.estado}</span>
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default InteractiveMap;