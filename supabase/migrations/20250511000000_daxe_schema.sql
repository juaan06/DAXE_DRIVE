-- Esquema DAXE para Supabase (PostgreSQL)
-- Convertido desde daxe.sql (MariaDB/MySQL). Ejecutar en: SQL Editor del panel de Supabase
-- o con CLI: supabase db push (si usas Supabase CLI enlazado al proyecto).

-- Tipos ENUM equivalentes a MySQL
CREATE TYPE public.estado_documento_legal AS ENUM (
  'vigente',
  'proximo_vencer',
  'vencido',
  'tramite_urgente'
);

CREATE TYPE public.tipo_leccion AS ENUM (
  'lectura',
  'video',
  'cuestionario',
  'simulador'
);

CREATE TYPE public.estado_log_scraper AS ENUM (
  'exitoso',
  'fallo',
  'contingencia'
);

CREATE TYPE public.tipo_punto_critico AS ENUM (
  'accidentalidad',
  'tramites',
  'practica'
);

-- Tablas base (sin FK externas o solo catálogos)
CREATE TABLE public.roles (
  id_rol SERIAL PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL UNIQUE,
  descripcion TEXT
);

CREATE TABLE public.categorias_norma (
  id_categoria_norma SERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE public.categorias_vehiculo (
  id_categoria SERIAL PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE,
  descripcion TEXT
);

CREATE TABLE public.distintivos (
  id_distintivo SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  imagen_url VARCHAR(255),
  condicion TEXT
);

CREATE TABLE public.tipos_combustible (
  id_combustible SERIAL PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE public.tipos_documento_legal (
  id_tipo_doc SERIAL PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE public.tipos_emergencia (
  id_tipo SERIAL PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE public.tipos_mantenimiento (
  id_tipo_mant SERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE public.tipos_notificacion (
  id_tipo_notif SERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE public.municipios (
  id_municipio SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  codigo_dane CHAR(8) NOT NULL UNIQUE
);

CREATE TABLE public.marcas_vehiculo (
  id_marca SERIAL PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE public.log_scraper (
  id_log SERIAL PRIMARY KEY,
  estado estado_log_scraper NOT NULL,
  detalle TEXT,
  registros_actualizados INTEGER NOT NULL DEFAULT 0,
  ejecutado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.usuarios (
  id_usuario SERIAL PRIMARY KEY,
  id_rol INTEGER NOT NULL REFERENCES public.roles (id_rol),
  nombres VARCHAR(80) NOT NULL,
  apellidos VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  fecha_nacimiento DATE,
  foto_perfil_url VARCHAR(255),
  activo BOOLEAN NOT NULL DEFAULT true,
  fecha_registro TIMESTAMPTZ NOT NULL DEFAULT now(),
  fecha_actualizacion TIMESTAMPTZ
);

CREATE TABLE public.ubicaciones_favoritas (
  id_ubicacion SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES public.usuarios (id_usuario) ON DELETE CASCADE,
  nombre_alias VARCHAR(80) NOT NULL,
  latitud NUMERIC(10, 8) NOT NULL,
  longitud NUMERIC(11, 8) NOT NULL,
  direccion VARCHAR(255),
  id_municipio INTEGER NOT NULL REFERENCES public.municipios (id_municipio),
  fecha_guardado TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.rutas_favoritas (
  id_ruta SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES public.usuarios (id_usuario) ON DELETE CASCADE,
  nombre_alias VARCHAR(80) NOT NULL,
  id_origen INTEGER NOT NULL REFERENCES public.ubicaciones_favoritas (id_ubicacion),
  id_destino INTEGER NOT NULL REFERENCES public.ubicaciones_favoritas (id_ubicacion),
  distancia_km NUMERIC(8, 2),
  duracion_min INTEGER,
  fecha_guardado TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.cursos (
  id_curso SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  imagen_url VARCHAR(255),
  publicado BOOLEAN NOT NULL DEFAULT false,
  creado_por INTEGER NOT NULL REFERENCES public.usuarios (id_usuario),
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.noticias (
  id_noticia SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  imagen_url VARCHAR(255),
  publicada BOOLEAN NOT NULL DEFAULT false,
  creado_por INTEGER NOT NULL REFERENCES public.usuarios (id_usuario),
  fecha_publicacion TIMESTAMPTZ,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.directorio_emergencias (
  id_emergencia SERIAL PRIMARY KEY,
  id_tipo INTEGER NOT NULL REFERENCES public.tipos_emergencia (id_tipo),
  id_municipio INTEGER REFERENCES public.municipios (id_municipio),
  nombre VARCHAR(120) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE public.vehiculos (
  id_vehiculo SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES public.usuarios (id_usuario),
  id_categoria INTEGER NOT NULL REFERENCES public.categorias_vehiculo (id_categoria),
  id_marca INTEGER NOT NULL REFERENCES public.marcas_vehiculo (id_marca),
  id_combustible INTEGER NOT NULL REFERENCES public.tipos_combustible (id_combustible),
  placa VARCHAR(10) NOT NULL UNIQUE,
  modelo SMALLINT NOT NULL,
  color VARCHAR(40),
  activo BOOLEAN NOT NULL DEFAULT true,
  fecha_registro TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.lecciones (
  id_leccion SERIAL PRIMARY KEY,
  id_curso INTEGER NOT NULL REFERENCES public.cursos (id_curso) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  contenido TEXT NOT NULL,
  orden SMALLINT NOT NULL,
  tipo tipo_leccion NOT NULL,
  duracion_min INTEGER
);

CREATE TABLE public.documentos_legales_vehiculo (
  id_documento SERIAL PRIMARY KEY,
  id_vehiculo INTEGER NOT NULL REFERENCES public.vehiculos (id_vehiculo) ON DELETE CASCADE,
  id_tipo_doc INTEGER NOT NULL REFERENCES public.tipos_documento_legal (id_tipo_doc),
  fecha_expedicion DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  estado estado_documento_legal NOT NULL DEFAULT 'vigente',
  archivo_url VARCHAR(255),
  fecha_carga TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.mantenimientos_vehiculo (
  id_mantenimiento SERIAL PRIMARY KEY,
  id_vehiculo INTEGER NOT NULL REFERENCES public.vehiculos (id_vehiculo) ON DELETE CASCADE,
  id_tipo_mant INTEGER NOT NULL REFERENCES public.tipos_mantenimiento (id_tipo_mant),
  descripcion TEXT NOT NULL,
  fecha_realizado DATE,
  fecha_proximo DATE,
  kilometraje INTEGER,
  costo NUMERIC(12, 2),
  taller VARCHAR(120),
  fecha_registro TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.normas_transito (
  id_norma SERIAL PRIMARY KEY,
  id_categoria INTEGER NOT NULL REFERENCES public.categorias_norma (id_categoria_norma),
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  id_categoria_vehiculo INTEGER REFERENCES public.categorias_vehiculo (id_categoria),
  costo_multa NUMERIC(12, 2),
  articulo_legal VARCHAR(60),
  activo BOOLEAN NOT NULL DEFAULT true,
  creado_por INTEGER NOT NULL REFERENCES public.usuarios (id_usuario),
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now(),
  fecha_actualizacion TIMESTAMPTZ
);

CREATE TABLE public.noticias_favoritas (
  id_usuario INTEGER NOT NULL REFERENCES public.usuarios (id_usuario) ON DELETE CASCADE,
  id_noticia INTEGER NOT NULL REFERENCES public.noticias (id_noticia) ON DELETE CASCADE,
  fecha_guardado TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (id_usuario, id_noticia)
);

CREATE TABLE public.notificaciones (
  id_notificacion SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES public.usuarios (id_usuario) ON DELETE CASCADE,
  id_tipo_notif INTEGER NOT NULL REFERENCES public.tipos_notificacion (id_tipo_notif),
  mensaje TEXT NOT NULL,
  leida BOOLEAN NOT NULL DEFAULT false,
  fecha_envio TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.pico_y_placa (
  id_pico_placa SERIAL PRIMARY KEY,
  id_log INTEGER NOT NULL REFERENCES public.log_scraper (id_log),
  id_municipio INTEGER NOT NULL REFERENCES public.municipios (id_municipio),
  id_categoria INTEGER NOT NULL REFERENCES public.categorias_vehiculo (id_categoria),
  fecha DATE NOT NULL,
  digitos_restringidos VARCHAR(20) NOT NULL,
  fuente_oficial VARCHAR(255),
  validado_admin BOOLEAN NOT NULL DEFAULT false,
  fecha_extraccion TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_pico_y_placa_municipio_categoria_fecha UNIQUE (id_municipio, id_categoria, fecha)
);

CREATE TABLE public.puntos_criticos (
  id_punto SERIAL PRIMARY KEY,
  id_municipio INTEGER NOT NULL REFERENCES public.municipios (id_municipio),
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  latitud NUMERIC(10, 8) NOT NULL,
  longitud NUMERIC(11, 8) NOT NULL,
  tipo tipo_punto_critico NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE public.puntuacion_conductor (
  id_usuario INTEGER PRIMARY KEY REFERENCES public.usuarios (id_usuario) ON DELETE CASCADE,
  puntaje_total NUMERIC(7, 2) NOT NULL DEFAULT 0,
  cursos_completados INTEGER NOT NULL DEFAULT 0,
  promedio_simuladores NUMERIC(5, 2),
  nivel VARCHAR(40),
  ultima_actualizacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.sesiones (
  id_sesion CHAR(64) PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES public.usuarios (id_usuario) ON DELETE CASCADE,
  ip_origen VARCHAR(45),
  user_agent VARCHAR(255),
  creada_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  expira_en TIMESTAMPTZ NOT NULL,
  activa BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE public.usuario_distintivo (
  id_usuario INTEGER NOT NULL REFERENCES public.usuarios (id_usuario) ON DELETE CASCADE,
  id_distintivo INTEGER NOT NULL REFERENCES public.distintivos (id_distintivo),
  fecha_obtencion TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (id_usuario, id_distintivo)
);

CREATE TABLE public.usuario_leccion (
  id_usuario INTEGER NOT NULL REFERENCES public.usuarios (id_usuario) ON DELETE CASCADE,
  id_leccion INTEGER NOT NULL REFERENCES public.lecciones (id_leccion) ON DELETE CASCADE,
  completada BOOLEAN NOT NULL DEFAULT false,
  puntaje NUMERIC(5, 2),
  fecha_inicio TIMESTAMPTZ,
  fecha_completado TIMESTAMPTZ,
  PRIMARY KEY (id_usuario, id_leccion)
);

CREATE TABLE public.vehiculo_ruta (
  id_vehiculo INTEGER NOT NULL REFERENCES public.vehiculos (id_vehiculo) ON DELETE CASCADE,
  id_ruta INTEGER NOT NULL REFERENCES public.rutas_favoritas (id_ruta) ON DELETE CASCADE,
  consumo_estimado_litros NUMERIC(6, 2),
  fecha_vinculo TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (id_vehiculo, id_ruta)
);

CREATE TABLE public.zonas_exentas (
  id_zona SERIAL PRIMARY KEY,
  id_municipio INTEGER NOT NULL REFERENCES public.municipios (id_municipio),
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  latitud_centro NUMERIC(10, 8),
  longitud_centro NUMERIC(11, 8),
  activo BOOLEAN NOT NULL DEFAULT true
);

-- Índices adicionales (equivalentes a los KEY de MySQL no cubiertos por PK/UNIQUE/FK)
CREATE INDEX idx_cursos_creado_por ON public.cursos (creado_por);
CREATE INDEX idx_directorio_tipo ON public.directorio_emergencias (id_tipo);
CREATE INDEX idx_directorio_municipio ON public.directorio_emergencias (id_municipio);
CREATE INDEX idx_documentos_tipo ON public.documentos_legales_vehiculo (id_tipo_doc);
CREATE INDEX idx_docs_vehiculo_venc ON public.documentos_legales_vehiculo (id_vehiculo, fecha_vencimiento);
CREATE INDEX idx_lecciones_curso ON public.lecciones (id_curso);
CREATE INDEX idx_mantenimientos_vehiculo ON public.mantenimientos_vehiculo (id_vehiculo);
CREATE INDEX idx_mantenimientos_tipo ON public.mantenimientos_vehiculo (id_tipo_mant);
CREATE INDEX idx_normas_categoria_veh ON public.normas_transito (id_categoria_vehiculo);
CREATE INDEX idx_normas_creador ON public.normas_transito (creado_por);
CREATE INDEX idx_normas_categoria ON public.normas_transito (id_categoria);
CREATE INDEX idx_noticias_creador ON public.noticias (creado_por);
CREATE INDEX idx_noticias_publicadas ON public.noticias (publicada, fecha_publicacion);
CREATE INDEX idx_noticias_fav_noticia ON public.noticias_favoritas (id_noticia);
CREATE INDEX idx_notif_tipo ON public.notificaciones (id_tipo_notif);
CREATE INDEX idx_notif_usuario_leida ON public.notificaciones (id_usuario, leida);
CREATE INDEX idx_pp_categoria ON public.pico_y_placa (id_categoria);
CREATE INDEX idx_pp_fecha ON public.pico_y_placa (fecha, id_municipio);
CREATE INDEX idx_pp_log ON public.pico_y_placa (id_log);
CREATE INDEX idx_puntos_municipio ON public.puntos_criticos (id_municipio);
CREATE INDEX idx_rutas_usuario ON public.rutas_favoritas (id_usuario);
CREATE INDEX idx_rutas_origen ON public.rutas_favoritas (id_origen);
CREATE INDEX idx_rutas_destino ON public.rutas_favoritas (id_destino);
CREATE INDEX idx_sesiones_usuario ON public.sesiones (id_usuario);
CREATE INDEX idx_ubic_usuario ON public.ubicaciones_favoritas (id_usuario);
CREATE INDEX idx_ubic_municipio ON public.ubicaciones_favoritas (id_municipio);
CREATE INDEX idx_usuarios_rol ON public.usuarios (id_rol);
CREATE INDEX idx_ud_distintivo ON public.usuario_distintivo (id_distintivo);
CREATE INDEX idx_ul_leccion ON public.usuario_leccion (id_leccion);
CREATE INDEX idx_ul_usuario ON public.usuario_leccion (id_usuario);
CREATE INDEX idx_vehiculos_categoria ON public.vehiculos (id_categoria);
CREATE INDEX idx_vehiculos_marca ON public.vehiculos (id_marca);
CREATE INDEX idx_vehiculos_combustible ON public.vehiculos (id_combustible);
CREATE INDEX idx_vehiculos_usuario ON public.vehiculos (id_usuario);
CREATE INDEX idx_vehiculos_placa ON public.vehiculos (placa);
CREATE INDEX idx_vr_ruta ON public.vehiculo_ruta (id_ruta);
CREATE INDEX idx_zonas_municipio ON public.zonas_exentas (id_municipio);

-- Sustituye ON UPDATE current_timestamp() de MySQL
CREATE OR REPLACE FUNCTION public.daxe_set_usuarios_fecha_actualizacion()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.fecha_actualizacion := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_usuarios_fecha_actualizacion
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.daxe_set_usuarios_fecha_actualizacion();

CREATE OR REPLACE FUNCTION public.daxe_set_normas_fecha_actualizacion()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.fecha_actualizacion := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_normas_fecha_actualizacion
  BEFORE UPDATE ON public.normas_transito
  FOR EACH ROW
  EXECUTE FUNCTION public.daxe_set_normas_fecha_actualizacion();

CREATE OR REPLACE FUNCTION public.daxe_set_puntuacion_ultima_actualizacion()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.ultima_actualizacion := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_puntuacion_ultima_actualizacion
  BEFORE UPDATE ON public.puntuacion_conductor
  FOR EACH ROW
  EXECUTE FUNCTION public.daxe_set_puntuacion_ultima_actualizacion();

-- Nota: configura Row Level Security (RLS) y políticas según quién puede leer/escribir cada tabla.
-- Sin RLS, el acceso depende solo de la clave anon/service role del cliente.
