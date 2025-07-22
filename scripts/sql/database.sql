CREATE DATABASE IF NOT EXISTS miuniversidad;


CREATE SCHEMA IF NOT EXISTS prod;


SET search_path = prod, public;


CREATE TABLE prod.carrera (
  id     SERIAL    PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE
);


CREATE TABLE prod.plan_estudio (
  id         SERIAL PRIMARY KEY,
  carrera_id INT    NOT NULL
                   REFERENCES prod.carrera(id)
                   ON DELETE RESTRICT,
  anio       INT    NOT NULL,
  UNIQUE(carrera_id, anio)
);


CREATE TABLE prod.materia (
  id               SERIAL    PRIMARY KEY,
  codigo_materia   CHAR(5)    NOT NULL
                     UNIQUE
                     CHECK (codigo_materia ~ '^[0-9]{5}$'),
  nombre_materia   VARCHAR(255) NOT NULL,
  tipo             VARCHAR(20)  NOT NULL
                     CHECK (tipo IN ('cursable','electiva')),
  horas_semanales  INT          NOT NULL
                     CHECK (horas_semanales > 0)
);


CREATE TABLE prod.plan_materia (
  plan_estudio_id INT NOT NULL
                   REFERENCES prod.plan_estudio(id)
                   ON DELETE CASCADE,
  materia_id      INT NOT NULL
                   REFERENCES prod.materia(id)
                   ON DELETE CASCADE,
  anio_cursada    INT NOT NULL,
  cuatrimestre    INT NOT NULL
                   CHECK (cuatrimestre IN (1,2)),
  PRIMARY KEY (plan_estudio_id, materia_id)
);


CREATE TABLE prod.correlativa (
  plan_estudio_id        INT NOT NULL,
  materia_id             INT NOT NULL,
  correlativa_materia_id INT NOT NULL,
  PRIMARY KEY (
    plan_estudio_id,
    materia_id,
    correlativa_materia_id
  ),
  FOREIGN KEY (plan_estudio_id, materia_id)
    REFERENCES prod.plan_materia(plan_estudio_id, materia_id)
    ON DELETE CASCADE,
  FOREIGN KEY (plan_estudio_id, correlativa_materia_id)
    REFERENCES prod.plan_materia(plan_estudio_id, materia_id)
    ON DELETE CASCADE,
  CHECK (materia_id <> correlativa_materia_id)
);


CREATE TABLE prod.usuario (
  id            SERIAL        PRIMARY KEY,
  nombre        VARCHAR(100)  NOT NULL,
  apellido      VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  creado_at     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TYPE prod.tipo_autenticacion_enum AS ENUM (
  'github',
  'google',
  'facebook',
  'twitter',
  'microsoft',
  'ldap',
  'email',
  'local'
);


CREATE TABLE prod.usuario_autenticacion (
  usuario_id           INT                          NOT NULL
                                                   REFERENCES prod.usuario(id)
                                                   ON DELETE CASCADE,
  tipo_autenticacion   prod.tipo_autenticacion_enum NOT NULL,
  external_id          VARCHAR(255)                 NOT NULL,  -- ID que provee el proveedor
  datos_extra          JSONB,                                 -- opcional: tokens, perfil, etc.
  creado_at            TIMESTAMPTZ                   NOT NULL DEFAULT now(),
  PRIMARY KEY (usuario_id, tipo_autenticacion),
  UNIQUE (tipo_autenticacion, external_id)
);


CREATE TABLE prod.usuario_plan_estudio (
  usuario_id      INT     NOT NULL
                       REFERENCES prod.usuario(id)
                       ON DELETE CASCADE,
  plan_estudio_id INT     NOT NULL
                       REFERENCES prod.plan_estudio(id)
                       ON DELETE CASCADE,
  PRIMARY KEY (usuario_id, plan_estudio_id)
);


CREATE TABLE prod.usuario_materia_estado (
  usuario_id         INT     NOT NULL,
  plan_estudio_id    INT     NOT NULL,
  materia_id         INT     NOT NULL,
  nota               NUMERIC(5,2)
                       CHECK (nota >= 0 AND nota <= 10),
  anio_cursada       INT,
  cuatrimestre       INT
                       CHECK (cuatrimestre IN (1,2)),
  estado             VARCHAR(20) NOT NULL
                       CHECK (estado IN (
                         'Aprobada',
                         'Regularizada',
                         'Pendiente',
                         'En Curso',
                         'En Final'
                       )),
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (
    usuario_id,
    plan_estudio_id,
    materia_id
  ),
  -- FK compuesta: el usuario debe estar inscrito en ese plan
  FOREIGN KEY (usuario_id, plan_estudio_id)
    REFERENCES prod.usuario_plan_estudio(usuario_id, plan_estudio_id)
    ON DELETE CASCADE,
  -- FK compuesta: la materia debe existir en ese plan
  FOREIGN KEY (plan_estudio_id, materia_id)
    REFERENCES prod.plan_materia(plan_estudio_id, materia_id)
    ON DELETE RESTRICT
);

CREATE TABLE prod.usuario_materia_cursada (
  usuario_id                         INT   NOT NULL
                                           REFERENCES prod.usuario(id)
                                           ON DELETE CASCADE,
  plan_estudio_id                    INT   NOT NULL,
  materia_id                         INT   NOT NULL,
  anio_cursada                       INT   NOT NULL,
  cuatrimestre_cursada               INT   NOT NULL
                                           CHECK (cuatrimestre_cursada IN (1,2)),
  nota_primer_parcial                NUMERIC(5,2)
                                           CHECK (nota_primer_parcial  BETWEEN 0 AND 10),
  nota_segundo_parcial               NUMERIC(5,2)
                                           CHECK (nota_segundo_parcial BETWEEN 0 AND 10),
  nota_recuperatorio_primer_parcial  NUMERIC(5,2)
                                           CHECK (nota_recuperatorio_primer_parcial BETWEEN 0 AND 10),
  nota_recuperatorio_segundo_parcial NUMERIC(5,2)
                                           CHECK (nota_recuperatorio_segundo_parcial BETWEEN 0 AND 10),
  fecha_actualizacion                TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Claves primarias y foráneas compuestas
  PRIMARY KEY (
    usuario_id,
    plan_estudio_id,
    materia_id,
    anio_cursada,
    cuatrimestre_cursada
  ),

  -- 1) El usuario debe estar inscrito en ese plan
  FOREIGN KEY (usuario_id, plan_estudio_id)
    REFERENCES prod.usuario_plan_estudio(usuario_id, plan_estudio_id)
    ON DELETE CASCADE,

  -- 2) La materia debe pertenecer a ese plan de estudio
  FOREIGN KEY (plan_estudio_id, materia_id)
    REFERENCES prod.plan_materia(plan_estudio_id, materia_id)
    ON DELETE RESTRICT
);
