-- Script para insertar los datos del plan de estudios de Ingeniería en Sistemas
-- Basado en los datos de planes-estudio.data.ts

SET search_path = prod, public;

-- 1. Insertar la carrera
INSERT INTO prod.carrera (nombre) 
VALUES ('Ingeniería en Sistemas')
ON CONFLICT (nombre) DO NOTHING;

-- 2. Insertar el plan de estudio
INSERT INTO prod.plan_estudio (carrera_id, anio)
SELECT c.id, 2023
FROM prod.carrera c
WHERE c.nombre = 'Ingeniería en Sistemas'
ON CONFLICT (carrera_id, anio) DO NOTHING;

-- 3. Insertar todas las materias (cursables y electivas)
INSERT INTO prod.materia (codigo_materia, nombre_materia, tipo, horas_semanales) VALUES
('00901', 'INGLES NIVEL I', 'cursable', 4),
('00902', 'INGLES NIVEL II', 'cursable', 4),
('00903', 'INGLES NIVEL III', 'cursable', 4),
('00904', 'INGLES NIVEL IV', 'cursable', 4),
('00911', 'COMPUTACION NIVEL I', 'cursable', 4),
('00912', 'COMPUTACION  NIVEL II', 'cursable', 4),
('03621', 'MATEMATICA DISCRETA', 'cursable', 4),
('03622', 'ANALISIS MATEMATICO I', 'cursable', 4),
('03623', 'PROGRAMACION INICIAL', 'cursable', 4),
('03624', 'INTRODUCCION A LOS SISTEMAS DE INFORMACION', 'cursable', 4),
('03625', 'SISTEMAS DE NUMERACION', 'cursable', 4),
('03626', 'PRINCIPIOS DE CALIDAD DE SOFTWARE', 'cursable', 4),
('03627', 'ALGEBRA Y GEOMETRIA ANALITICA I', 'cursable', 4),
('03628', 'FISICA I', 'cursable', 4),
('03629', 'PROGRAMACION ESTRUCTURADA BASICA', 'cursable', 4),
('03630', 'INTRODUCCION A LA GESTION DE REQUISITOS', 'cursable', 4),
('03631', 'FUNDAMENTOS DE SISTEMAS EMBEBIDOS', 'cursable', 4),
('03632', 'INTRODUCCION A LOS PROYECTOS INFORMATICOS', 'cursable', 4),
('03633', 'ANALISIS MATEMATICO II', 'cursable', 4),
('03634', 'FISICA II', 'cursable', 4),
('03635', 'TOPICOS DE PROGRAMACION', 'cursable', 4),
('03636', 'BASES DE DATOS', 'cursable', 4),
('03637', 'ANALISIS DE SISTEMAS', 'cursable', 4),
('03638', 'ARQUITECTURA DE COMPUTADORAS', 'cursable', 4),
('03639', 'ANALISIS MATEMATICO III', 'cursable', 4),
('03640', 'ALGORITMOS Y ESTRUCTURAS DE DATOS', 'cursable', 4),
('03641', 'BASES DE DATOS APLICADAS', 'cursable', 4),
('03642', 'PRINCIPIOS DE DISEÑO DE SISTEMAS', 'cursable', 4),
('03643', 'REDES DE COMPUTADORAS', 'cursable', 4),
('03644', 'GESTION DE LAS ORGANIZACIONES', 'cursable', 4),
('03645', 'ALGEBRA Y GEOMETRIA ANALITICA II', 'cursable', 4),
('03646', 'PARADIGMAS DE PROGRAMACION', 'cursable', 4),
('03647', 'REQUISITOS AVANZADOS', 'cursable', 4),
('03648', 'DISEÑO DE SOFTWARE', 'cursable', 4),
('03649', 'SISTEMAS OPERATIVOS', 'cursable', 4),
('03650', 'SEGURIDAD DE LA INFORMACION', 'cursable', 4),
('03651', 'PROBABILIDAD Y ESTADISTICA', 'cursable', 4),
('03652', 'PROGRAMACION AVANZADA', 'cursable', 4),
('03653', 'ARQUITECTURA DE SISTEMAS SOFTWARE', 'cursable', 4),
('03654', 'VIRTUALIZACION DE HARDWARE', 'cursable', 4),
('03655', 'AUDITORIA Y LEGISLACION', 'cursable', 4),
('03656', 'ESTADISTICA APLICADA', 'cursable', 4),
('03657', 'AUTOMATAS Y GRAMATICAS', 'cursable', 4),
('03658', 'PROGRAMACION CONCURRENTE', 'cursable', 4),
('03659', 'GESTION APLICADA AL DESARROLLO DE SOFTWARE I', 'cursable', 4),
('03660', 'SISTEMAS OPERATIVOS AVANZADOS', 'cursable', 4),
('03661', 'GESTION DE PROYECTOS', 'cursable', 4),
('03662', 'MATEMATICA APLICADA', 'cursable', 6),
('03663', 'LENGUAJES Y COMPILADORES', 'cursable', 4),
('03664', 'INTELIGENCIA ARTIFICIAL', 'cursable', 4),
('03665', 'GESTION APLICADA AL DESARROLLO DE SOFTWARE II', 'cursable', 4),
('03666', 'SEGURIDAD APLICADA Y FORENSIA', 'cursable', 4),
('03667', 'GESTION DE LA CALIDAD EN PROCESOS DE SISTEMAS', 'cursable', 4),
('03668', 'INTELIGENCIA ARTIFICIAL APLICADA', 'cursable', 4),
('03669', 'INNOVACION Y EMPRENDEDORISMO', 'cursable', 4),
('03670', 'CIENCIA DE DATOS', 'cursable', 4),
('03671', 'PROYECTO FINAL DE CARRERA', 'cursable', 4),
('03675', 'PRACTICA PROFESIONAL SUPERVISADA', 'cursable', 4),
('03676', 'RESPONSABILIDAD SOCIAL UNIVERSITARIA', 'cursable', 4),
-- Materias electivas (sin horas semanales específicas según tus datos)
('03672', 'ELECTIVA I', 'electiva', 4),
('03673', 'ELECTIVA II', 'electiva', 4),
('03674', 'ELECTIVA III', 'electiva', 4),
-- Opciones específicas para las electivas (si necesitas registrarlas como materias separadas)
('05005', 'OPCION ELECTIVA 5005', 'cursable', 4),
('05006', 'OPCION ELECTIVA 5006', 'cursable', 4),
('05007', 'OPCION ELECTIVA 5007', 'cursable', 4),
('05862', 'OPCION ELECTIVA 5862', 'cursable', 4)
ON CONFLICT (codigo_materia) DO UPDATE SET
  nombre_materia = EXCLUDED.nombre_materia,
  tipo = EXCLUDED.tipo,
  horas_semanales = EXCLUDED.horas_semanales;

-- 4. Relacionar materias con el plan de estudio
INSERT INTO prod.plan_materia (plan_estudio_id, materia_id, anio_cursada, cuatrimestre)
SELECT pe.id, m.id, anio_cursada, cuatrimestre
FROM prod.plan_estudio pe, prod.carrera c,
     (VALUES
       ('00901', 1, 2), ('00902', 2, 1), ('00903', 2, 2), ('00904', 3, 1),
       ('00911', 1, 2), ('00912', 2, 1),
       ('03621', 1, 1), ('03622', 1, 1), ('03623', 1, 1), ('03624', 1, 1),
       ('03625', 1, 1), ('03626', 1, 1), ('03627', 1, 2), ('03628', 1, 2),
       ('03629', 1, 2), ('03630', 1, 2), ('03631', 1, 2), ('03632', 1, 2),
       ('03633', 2, 1), ('03634', 2, 1), ('03635', 2, 1), ('03636', 2, 1),
       ('03637', 2, 1), ('03638', 2, 1), ('03639', 2, 2), ('03640', 2, 2),
       ('03641', 2, 2), ('03642', 2, 2), ('03643', 2, 2), ('03644', 2, 2),
       ('03645', 3, 1), ('03646', 3, 1), ('03647', 3, 1), ('03648', 3, 1),
       ('03649', 3, 1), ('03650', 3, 1), ('03651', 3, 2), ('03652', 3, 2),
       ('03653', 3, 2), ('03654', 3, 2), ('03655', 3, 2), ('03656', 4, 1),
       ('03657', 4, 1), ('03658', 4, 1), ('03659', 4, 1), ('03660', 4, 1),
       ('03661', 4, 1), ('03662', 4, 2), ('03663', 4, 2), ('03664', 4, 2),
       ('03665', 4, 2), ('03666', 4, 2), ('03667', 4, 2), ('03668', 5, 1),
       ('03669', 5, 1), ('03670', 5, 1), ('03671', 5, 1), ('03675', 3, 1),
       ('03676', 2, 1), ('03672', 5, 1), ('03673', 5, 2), ('03674', 5, 2)
     ) AS materias_plan(codigo, anio_cursada, cuatrimestre),
     prod.materia m
WHERE pe.carrera_id = c.id
  AND c.nombre = 'Ingeniería en Sistemas'
  AND pe.anio = 2023
  AND m.codigo_materia = materias_plan.codigo
ON CONFLICT (plan_estudio_id, materia_id) DO UPDATE SET
  anio_cursada = EXCLUDED.anio_cursada,
  cuatrimestre = EXCLUDED.cuatrimestre;

-- 5. Insertar las correlativas
-- Obtener el plan_estudio_id para usar en las correlativas
DO $$
DECLARE
    plan_id INT;
BEGIN
    SELECT pe.id INTO plan_id
    FROM prod.plan_estudio pe, prod.carrera c
    WHERE pe.carrera_id = c.id
      AND c.nombre = 'Ingeniería en Sistemas'
      AND pe.anio = 2023;

    -- Insertar correlativas
    INSERT INTO prod.correlativa (plan_estudio_id, materia_id, correlativa_materia_id)
    SELECT plan_id, m1.id, m2.id
    FROM (VALUES
        ('00902', '00901'), -- INGLES NIVEL II requiere INGLES NIVEL I
        ('00903', '00902'), -- INGLES NIVEL III requiere INGLES NIVEL II
        ('00904', '00903'), -- INGLES NIVEL IV requiere INGLES NIVEL III
        ('00912', '00911'), -- COMPUTACION NIVEL II requiere COMPUTACION NIVEL I
        ('03628', '03622'), -- FISICA I requiere ANALISIS MATEMATICO I
        ('03629', '03623'), -- PROGRAMACION ESTRUCTURADA BASICA requiere PROGRAMACION INICIAL
        ('03630', '03624'), -- INTRODUCCION A LA GESTION DE REQUISITOS requiere INTRODUCCION A LOS SISTEMAS DE INFORMACION
        ('03631', '03625'), -- FUNDAMENTOS DE SISTEMAS EMBEBIDOS requiere SISTEMAS DE NUMERACION
        ('03633', '03622'), -- ANALISIS MATEMATICO II requiere ANALISIS MATEMATICO I
        ('03634', '03628'), -- FISICA II requiere FISICA I
        ('03635', '03621'), -- TOPICOS DE PROGRAMACION requiere MATEMATICA DISCRETA
        ('03635', '03629'), -- TOPICOS DE PROGRAMACION requiere PROGRAMACION ESTRUCTURADA BASICA
        ('03636', '03621'), -- BASES DE DATOS requiere MATEMATICA DISCRETA
        ('03636', '03629'), -- BASES DE DATOS requiere PROGRAMACION ESTRUCTURADA BASICA
        ('03637', '03630'), -- ANALISIS DE SISTEMAS requiere INTRODUCCION A LA GESTION DE REQUISITOS
        ('03638', '03631'), -- ARQUITECTURA DE COMPUTADORAS requiere FUNDAMENTOS DE SISTEMAS EMBEBIDOS
        ('03639', '03633'), -- ANALISIS MATEMATICO III requiere ANALISIS MATEMATICO II
        ('03640', '03635'), -- ALGORITMOS Y ESTRUCTURAS DE DATOS requiere TOPICOS DE PROGRAMACION
        ('03641', '03636'), -- BASES DE DATOS APLICADAS requiere BASES DE DATOS
        ('03642', '03626'), -- PRINCIPIOS DE DISEÑO DE SISTEMAS requiere PRINCIPIOS DE CALIDAD DE SOFTWARE
        ('03642', '03637'), -- PRINCIPIOS DE DISEÑO DE SISTEMAS requiere ANALISIS DE SISTEMAS
        ('03643', '03634'), -- REDES DE COMPUTADORAS requiere FISICA II
        ('03643', '03638'), -- REDES DE COMPUTADORAS requiere ARQUITECTURA DE COMPUTADORAS
        ('03644', '03632'), -- GESTION DE LAS ORGANIZACIONES requiere INTRODUCCION A LOS PROYECTOS INFORMATICOS
        ('03645', '03627'), -- ALGEBRA Y GEOMETRIA ANALITICA II requiere ALGEBRA Y GEOMETRIA ANALITICA I
        ('03646', '03633'), -- PARADIGMAS DE PROGRAMACION requiere ANALISIS MATEMATICO II
        ('03646', '03640'), -- PARADIGMAS DE PROGRAMACION requiere ALGORITMOS Y ESTRUCTURAS DE DATOS
        ('03647', '03642'), -- REQUISITOS AVANZADOS requiere PRINCIPIOS DE DISEÑO DE SISTEMAS
        ('03648', '03636'), -- DISEÑO DE SOFTWARE requiere BASES DE DATOS
        ('03648', '03642'), -- DISEÑO DE SOFTWARE requiere PRINCIPIOS DE DISEÑO DE SISTEMAS
        ('03649', '03638'), -- SISTEMAS OPERATIVOS requiere ARQUITECTURA DE COMPUTADORAS
        ('03650', '03635'), -- SEGURIDAD DE LA INFORMACION requiere TOPICOS DE PROGRAMACION
        ('03650', '03638'), -- SEGURIDAD DE LA INFORMACION requiere ARQUITECTURA DE COMPUTADORAS
        ('03650', '03643'), -- SEGURIDAD DE LA INFORMACION requiere REDES DE COMPUTADORAS
        ('03651', '03621'), -- PROBABILIDAD Y ESTADISTICA requiere MATEMATICA DISCRETA
        ('03651', '03639'), -- PROBABILIDAD Y ESTADISTICA requiere ANALISIS MATEMATICO III
        ('03651', '03645'), -- PROBABILIDAD Y ESTADISTICA requiere ALGEBRA Y GEOMETRIA ANALITICA II
        ('03652', '03646'), -- PROGRAMACION AVANZADA requiere PARADIGMAS DE PROGRAMACION
        ('03652', '03641'), -- PROGRAMACION AVANZADA requiere BASES DE DATOS APLICADAS
        ('03653', '03648'), -- ARQUITECTURA DE SISTEMAS SOFTWARE requiere DISEÑO DE SOFTWARE
        ('03654', '03640'), -- VIRTUALIZACION DE HARDWARE requiere ALGORITMOS Y ESTRUCTURAS DE DATOS
        ('03654', '03645'), -- VIRTUALIZACION DE HARDWARE requiere ALGEBRA Y GEOMETRIA ANALITICA II
        ('03654', '03649'), -- VIRTUALIZACION DE HARDWARE requiere SISTEMAS OPERATIVOS
        ('03655', '03650'), -- AUDITORIA Y LEGISLACION requiere SEGURIDAD DE LA INFORMACION
        ('03656', '03641'), -- ESTADISTICA APLICADA requiere BASES DE DATOS APLICADAS
        ('03656', '03651'), -- ESTADISTICA APLICADA requiere PROBABILIDAD Y ESTADISTICA
        ('03657', '03646'), -- AUTOMATAS Y GRAMATICAS requiere PARADIGMAS DE PROGRAMACION
        ('03658', '03646'), -- PROGRAMACION CONCURRENTE requiere PARADIGMAS DE PROGRAMACION
        ('03658', '03654'), -- PROGRAMACION CONCURRENTE requiere VIRTUALIZACION DE HARDWARE
        ('03659', '03644'), -- GESTION APLICADA AL DESARROLLO DE SOFTWARE I requiere GESTION DE LAS ORGANIZACIONES
        ('03659', '03647'), -- GESTION APLICADA AL DESARROLLO DE SOFTWARE I requiere REQUISITOS AVANZADOS
        ('03659', '03653'), -- GESTION APLICADA AL DESARROLLO DE SOFTWARE I requiere ARQUITECTURA DE SISTEMAS SOFTWARE
        ('03660', '03654'), -- SISTEMAS OPERATIVOS AVANZADOS requiere VIRTUALIZACION DE HARDWARE
        ('03661', '03644'), -- GESTION DE PROYECTOS requiere GESTION DE LAS ORGANIZACIONES
        ('03661', '03650'), -- GESTION DE PROYECTOS requiere SEGURIDAD DE LA INFORMACION
        ('03661', '03651'), -- GESTION DE PROYECTOS requiere PROBABILIDAD Y ESTADISTICA
        ('03662', '03651'), -- MATEMATICA APLICADA requiere PROBABILIDAD Y ESTADISTICA
        ('03663', '03657'), -- LENGUAJES Y COMPILADORES requiere AUTOMATAS Y GRAMATICAS
        ('03664', '03646'), -- INTELIGENCIA ARTIFICIAL requiere PARADIGMAS DE PROGRAMACION
        ('03664', '03651'), -- INTELIGENCIA ARTIFICIAL requiere PROBABILIDAD Y ESTADISTICA
        ('03665', '03652'), -- GESTION APLICADA AL DESARROLLO DE SOFTWARE II requiere PROGRAMACION AVANZADA
        ('03665', '03659'), -- GESTION APLICADA AL DESARROLLO DE SOFTWARE II requiere GESTION APLICADA AL DESARROLLO DE SOFTWARE I
        ('03666', '03649'), -- SEGURIDAD APLICADA Y FORENSIA requiere SISTEMAS OPERATIVOS
        ('03666', '03652'), -- SEGURIDAD APLICADA Y FORENSIA requiere PROGRAMACION AVANZADA
        ('03666', '03655'), -- SEGURIDAD APLICADA Y FORENSIA requiere AUDITORIA Y LEGISLACION
        ('03667', '03647'), -- GESTION DE LA CALIDAD EN PROCESOS DE SISTEMAS requiere REQUISITOS AVANZADOS
        ('03668', '03656'), -- INTELIGENCIA ARTIFICIAL APLICADA requiere ESTADISTICA APLICADA
        ('03668', '03664'), -- INTELIGENCIA ARTIFICIAL APLICADA requiere INTELIGENCIA ARTIFICIAL
        ('03669', '03661'), -- INNOVACION Y EMPRENDEDORISMO requiere GESTION DE PROYECTOS
        ('03670', '03656'), -- CIENCIA DE DATOS requiere ESTADISTICA APLICADA
        ('03670', '03664'), -- CIENCIA DE DATOS requiere INTELIGENCIA ARTIFICIAL
        ('03671', '03656'), -- PROYECTO FINAL DE CARRERA requiere ESTADISTICA APLICADA
        ('03671', '03659'), -- PROYECTO FINAL DE CARRERA requiere GESTION APLICADA AL DESARROLLO DE SOFTWARE I
        ('03671', '03660'), -- PROYECTO FINAL DE CARRERA requiere SISTEMAS OPERATIVOS AVANZADOS
        ('03671', '03661'), -- PROYECTO FINAL DE CARRERA requiere GESTION DE PROYECTOS
        ('03671', '03667'), -- PROYECTO FINAL DE CARRERA requiere GESTION DE LA CALIDAD EN PROCESOS DE SISTEMAS
        ('03675', '03642'), -- PRACTICA PROFESIONAL SUPERVISADA requiere PRINCIPIOS DE DISEÑO DE SISTEMAS
        ('03676', '03626')  -- RESPONSABILIDAD SOCIAL UNIVERSITARIA requiere PRINCIPIOS DE CALIDAD DE SOFTWARE
    ) AS correlativas(materia_codigo, correlativa_codigo), 
    prod.materia m1, prod.materia m2
    WHERE m1.codigo_materia = correlativas.materia_codigo
      AND m2.codigo_materia = correlativas.correlativa_codigo
    ON CONFLICT (plan_estudio_id, materia_id, correlativa_materia_id) DO NOTHING;
END
$$;

-- Verificación: Mostrar resumen de lo insertado
SELECT 
    'Carreras insertadas' as tipo,
    COUNT(*) as cantidad
FROM prod.carrera
WHERE nombre = 'Ingeniería en Sistemas'

UNION ALL

SELECT 
    'Planes de estudio insertados' as tipo,
    COUNT(*) as cantidad
FROM prod.plan_estudio pe
JOIN prod.carrera c ON pe.carrera_id = c.id
WHERE c.nombre = 'Ingeniería en Sistemas' AND pe.anio = 2023

UNION ALL

SELECT 
    'Materias insertadas' as tipo,
    COUNT(*) as cantidad
FROM prod.materia

UNION ALL

SELECT 
    'Relaciones plan-materia insertadas' as tipo,
    COUNT(*) as cantidad
FROM prod.plan_materia pm
JOIN prod.plan_estudio pe ON pm.plan_estudio_id = pe.id
JOIN prod.carrera c ON pe.carrera_id = c.id
WHERE c.nombre = 'Ingeniería en Sistemas' AND pe.anio = 2023

UNION ALL

SELECT 
    'Correlativas insertadas' as tipo,
    COUNT(*) as cantidad
FROM prod.correlativa co
JOIN prod.plan_estudio pe ON co.plan_estudio_id = pe.id
JOIN prod.carrera c ON pe.carrera_id = c.id
WHERE c.nombre = 'Ingeniería en Sistemas' AND pe.anio = 2023;
