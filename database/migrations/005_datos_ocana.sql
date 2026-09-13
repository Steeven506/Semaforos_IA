-- ============================================================================
-- DATOS DE PRUEBA - AV. FRANCISCO FERNANDEZ DE CONTRERAS - OCANA
-- ============================================================================

-- Verificar interseccion
INSERT INTO intersecciones (usuario_id, nombre, descripcion, latitud, longitud, direccion, ciudad, pais)
SELECT 1, 'Cruce Av. Francisco Fernandez de Contreras', 
       'Interseccion principal con la Calle del Colfer',
       8.2377, -73.3560, 'Av. Francisco Fernandez de Contreras con Calle del Colfer', 
       'Ocana', 'Colombia'
WHERE NOT EXISTS (
    SELECT 1 FROM intersecciones WHERE nombre = 'Cruce Av. Francisco Fernandez de Contreras'
);

-- Crear grupos de semaforos
INSERT INTO grupos_semaforos (interseccion_id, nombre, descripcion, color_grupo, direccion)
SELECT (SELECT id FROM intersecciones WHERE nombre = 'Cruce Av. Francisco Fernandez de Contreras' LIMIT 1),
       'Grupo Avenida', 'Semaforos de la Av. Francisco Fernandez de Contreras', 'azul', 'Norte-Sur'
WHERE NOT EXISTS (SELECT 1 FROM grupos_semaforos WHERE nombre = 'Grupo Avenida');

INSERT INTO grupos_semaforos (interseccion_id, nombre, descripcion, color_grupo, direccion)
SELECT (SELECT id FROM intersecciones WHERE nombre = 'Cruce Av. Francisco Fernandez de Contreras' LIMIT 1),
       'Grupo Colfer', 'Semaforos de la Calle del Colfer', 'naranja', 'Este-Oeste'
WHERE NOT EXISTS (SELECT 1 FROM grupos_semaforos WHERE nombre = 'Grupo Colfer');

-- Configurar sincronizacion (opuestos)
INSERT INTO sincronizacion_grupos (interseccion_id, grupo_a_id, grupo_b_id, offset_segundos, descripcion)
SELECT 
    (SELECT id FROM intersecciones WHERE nombre = 'Cruce Av. Francisco Fernandez de Contreras' LIMIT 1),
    (SELECT id FROM grupos_semaforos WHERE nombre = 'Grupo Avenida' LIMIT 1),
    (SELECT id FROM grupos_semaforos WHERE nombre = 'Grupo Colfer' LIMIT 1),
    0,
    'Avenida y Colfer son opuestos: cuando Avenida esta verde, Colfer esta rojo'
WHERE NOT EXISTS (
    SELECT 1 FROM sincronizacion_grupos 
    WHERE interseccion_id = (SELECT id FROM intersecciones WHERE nombre = 'Cruce Av. Francisco Fernandez de Contreras' LIMIT 1)
);