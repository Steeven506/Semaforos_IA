-- ============================================================================
-- SINCRONIZACION DE GRUPOS - AV. FRANCISCO FERNANDEZ DE CONTRERAS
-- ============================================================================

-- Obtener IDs
DO $$
DECLARE
    v_interseccion_id INTEGER;
    v_grupo_avenida INTEGER;
    v_grupo_colfer INTEGER;
BEGIN
    SELECT id INTO v_interseccion_id 
    FROM intersecciones 
    WHERE nombre = 'Cruce Av. Francisco Fernandez de Contreras' 
    LIMIT 1;

    IF v_interseccion_id IS NULL THEN
        RAISE NOTICE 'No se encontro la interseccion';
        RETURN;
    END IF;

    SELECT id INTO v_grupo_avenida 
    FROM grupos_semaforos 
    WHERE interseccion_id = v_interseccion_id 
      AND nombre = 'Grupo Avenida'
    LIMIT 1;

    SELECT id INTO v_grupo_colfer 
    FROM grupos_semaforos 
    WHERE interseccion_id = v_interseccion_id 
      AND nombre = 'Grupo Colfer'
    LIMIT 1;

    IF v_grupo_avenida IS NULL OR v_grupo_colfer IS NULL THEN
        RAISE NOTICE 'Faltan grupos. Creando...';
        
        IF v_grupo_avenida IS NULL THEN
            INSERT INTO grupos_semaforos (interseccion_id, nombre, descripcion, color_grupo, direccion)
            VALUES (v_interseccion_id, 'Grupo Avenida', 'Semaforos de la Av. Francisco Fernandez de Contreras', 'azul', 'Norte-Sur')
            RETURNING id INTO v_grupo_avenida;
        END IF;

        IF v_grupo_colfer IS NULL THEN
            INSERT INTO grupos_semaforos (interseccion_id, nombre, descripcion, color_grupo, direccion)
            VALUES (v_interseccion_id, 'Grupo Colfer', 'Semaforos de la Calle del Colfer', 'naranja', 'Este-Oeste')
            RETURNING id INTO v_grupo_colfer;
        END IF;
    END IF;

    -- Crear sincronizacion
    INSERT INTO sincronizacion_grupos 
    (interseccion_id, grupo_a_id, grupo_b_id, offset_segundos, descripcion)
    VALUES 
    (v_interseccion_id, v_grupo_avenida, v_grupo_colfer, 0, 
     'Avenida y Colfer son opuestos: cuando Avenida esta verde, Colfer esta rojo')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Sincronizacion creada: Avenida=%, Colfer=%', v_grupo_avenida, v_grupo_colfer;
END $$;