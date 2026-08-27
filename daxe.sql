-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-05-2026 a las 23:21:54
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `daxe`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_norma`
--

CREATE TABLE `categorias_norma` (
  `id_categoria_norma` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_vehiculo`
--

CREATE TABLE `categorias_vehiculo` (
  `id_categoria` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id_curso` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `publicado` tinyint(1) NOT NULL DEFAULT 0,
  `creado_por` int(10) UNSIGNED NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `directorio_emergencias`
--

CREATE TABLE `directorio_emergencias` (
  `id_emergencia` int(10) UNSIGNED NOT NULL,
  `id_tipo` int(10) UNSIGNED NOT NULL,
  `id_municipio` int(10) UNSIGNED DEFAULT NULL,
  `nombre` varchar(120) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `distintivos`
--

CREATE TABLE `distintivos` (
  `id_distintivo` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `condicion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos_legales_vehiculo`
--

CREATE TABLE `documentos_legales_vehiculo` (
  `id_documento` int(10) UNSIGNED NOT NULL,
  `id_vehiculo` int(10) UNSIGNED NOT NULL,
  `id_tipo_doc` int(10) UNSIGNED NOT NULL,
  `fecha_expedicion` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `estado` enum('vigente','proximo_vencer','vencido','tramite_urgente') NOT NULL DEFAULT 'vigente',
  `archivo_url` varchar(255) DEFAULT NULL,
  `fecha_carga` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lecciones`
--

CREATE TABLE `lecciones` (
  `id_leccion` int(10) UNSIGNED NOT NULL,
  `id_curso` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `contenido` text NOT NULL,
  `orden` tinyint(3) UNSIGNED NOT NULL,
  `tipo` enum('lectura','video','cuestionario','simulador') NOT NULL,
  `duracion_min` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `log_scraper`
--

CREATE TABLE `log_scraper` (
  `id_log` int(10) UNSIGNED NOT NULL,
  `estado` enum('exitoso','fallo','contingencia') NOT NULL,
  `detalle` text DEFAULT NULL,
  `registros_actualizados` int(10) UNSIGNED DEFAULT 0,
  `ejecutado_en` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mantenimientos_vehiculo`
--

CREATE TABLE `mantenimientos_vehiculo` (
  `id_mantenimiento` int(10) UNSIGNED NOT NULL,
  `id_vehiculo` int(10) UNSIGNED NOT NULL,
  `id_tipo_mant` int(10) UNSIGNED NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_realizado` date DEFAULT NULL,
  `fecha_proximo` date DEFAULT NULL,
  `kilometraje` int(10) UNSIGNED DEFAULT NULL,
  `costo` decimal(12,2) DEFAULT NULL,
  `taller` varchar(120) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marcas_vehiculo`
--

CREATE TABLE `marcas_vehiculo` (
  `id_marca` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `municipios`
--

CREATE TABLE `municipios` (
  `id_municipio` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `codigo_dane` char(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `normas_transito`
--

CREATE TABLE `normas_transito` (
  `id_norma` int(10) UNSIGNED NOT NULL,
  `id_categoria` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` text NOT NULL,
  `id_categoria_vehiculo` int(10) UNSIGNED DEFAULT NULL,
  `costo_multa` decimal(12,2) DEFAULT NULL,
  `articulo_legal` varchar(60) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `creado_por` int(10) UNSIGNED NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias`
--

CREATE TABLE `noticias` (
  `id_noticia` int(10) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `contenido` text NOT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `publicada` tinyint(1) NOT NULL DEFAULT 0,
  `creado_por` int(10) UNSIGNED NOT NULL,
  `fecha_publicacion` datetime DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias_favoritas`
--

CREATE TABLE `noticias_favoritas` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_noticia` int(10) UNSIGNED NOT NULL,
  `fecha_guardado` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_tipo_notif` int(10) UNSIGNED NOT NULL,
  `mensaje` text NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_envio` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pico_y_placa`
--

CREATE TABLE `pico_y_placa` (
  `id_pico_placa` int(10) UNSIGNED NOT NULL,
  `id_log` int(11) UNSIGNED NOT NULL,
  `id_municipio` int(10) UNSIGNED NOT NULL,
  `id_categoria` int(10) UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `digitos_restringidos` varchar(20) NOT NULL,
  `fuente_oficial` varchar(255) DEFAULT NULL,
  `validado_admin` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_extraccion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntos_criticos`
--

CREATE TABLE `puntos_criticos` (
  `id_punto` int(10) UNSIGNED NOT NULL,
  `id_municipio` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `latitud` decimal(10,8) NOT NULL,
  `longitud` decimal(11,8) NOT NULL,
  `tipo` enum('accidentalidad','tramites','practica') NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntuacion_conductor`
--

CREATE TABLE `puntuacion_conductor` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `puntaje_total` decimal(7,2) NOT NULL DEFAULT 0.00,
  `cursos_completados` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `promedio_simuladores` decimal(5,2) DEFAULT NULL,
  `nivel` varchar(40) DEFAULT NULL,
  `ultima_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rutas_favoritas`
--

CREATE TABLE `rutas_favoritas` (
  `id_ruta` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `nombre_alias` varchar(80) NOT NULL,
  `id_origen` int(10) UNSIGNED NOT NULL,
  `id_destino` int(10) UNSIGNED NOT NULL,
  `distancia_km` decimal(8,2) DEFAULT NULL,
  `duracion_min` int(11) DEFAULT NULL,
  `fecha_guardado` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones`
--

CREATE TABLE `sesiones` (
  `id_sesion` char(64) NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `ip_origen` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `creada_en` datetime NOT NULL DEFAULT current_timestamp(),
  `expira_en` datetime NOT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_combustible`
--

CREATE TABLE `tipos_combustible` (
  `id_combustible` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_documento_legal`
--

CREATE TABLE `tipos_documento_legal` (
  `id_tipo_doc` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_emergencia`
--

CREATE TABLE `tipos_emergencia` (
  `id_tipo` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_mantenimiento`
--

CREATE TABLE `tipos_mantenimiento` (
  `id_tipo_mant` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_notificacion`
--

CREATE TABLE `tipos_notificacion` (
  `id_tipo_notif` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicaciones_favoritas`
--

CREATE TABLE `ubicaciones_favoritas` (
  `id_ubicacion` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `nombre_alias` varchar(80) NOT NULL,
  `latitud` decimal(10,8) NOT NULL,
  `longitud` decimal(11,8) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `id_municipio` int(10) UNSIGNED NOT NULL,
  `fecha_guardado` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_rol` int(10) UNSIGNED NOT NULL,
  `nombres` varchar(80) NOT NULL,
  `apellidos` varchar(80) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `foto_perfil_url` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_distintivo`
--

CREATE TABLE `usuario_distintivo` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_distintivo` int(10) UNSIGNED NOT NULL,
  `fecha_obtencion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_leccion`
--

CREATE TABLE `usuario_leccion` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_leccion` int(10) UNSIGNED NOT NULL,
  `completada` tinyint(1) NOT NULL DEFAULT 0,
  `puntaje` decimal(5,2) DEFAULT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_completado` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculos`
--

CREATE TABLE `vehiculos` (
  `id_vehiculo` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_categoria` int(10) UNSIGNED NOT NULL,
  `id_marca` int(10) UNSIGNED NOT NULL,
  `id_combustible` int(10) UNSIGNED NOT NULL,
  `placa` varchar(10) NOT NULL,
  `modelo` year(4) NOT NULL,
  `color` varchar(40) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculo_ruta`
--

CREATE TABLE `vehiculo_ruta` (
  `id_vehiculo` int(10) UNSIGNED NOT NULL,
  `id_ruta` int(10) UNSIGNED NOT NULL,
  `consumo_estimado_litros` decimal(6,2) DEFAULT NULL,
  `fecha_vinculo` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `zonas_exentas`
--

CREATE TABLE `zonas_exentas` (
  `id_zona` int(10) UNSIGNED NOT NULL,
  `id_municipio` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `latitud_centro` decimal(10,8) DEFAULT NULL,
  `longitud_centro` decimal(11,8) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias_norma`
--
ALTER TABLE `categorias_norma`
  ADD PRIMARY KEY (`id_categoria_norma`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `categorias_vehiculo`
--
ALTER TABLE `categorias_vehiculo`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id_curso`),
  ADD KEY `fk_curso_creador` (`creado_por`);

--
-- Indices de la tabla `directorio_emergencias`
--
ALTER TABLE `directorio_emergencias`
  ADD PRIMARY KEY (`id_emergencia`),
  ADD KEY `fk_em_tipo` (`id_tipo`),
  ADD KEY `fk_em_municipio` (`id_municipio`);

--
-- Indices de la tabla `distintivos`
--
ALTER TABLE `distintivos`
  ADD PRIMARY KEY (`id_distintivo`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `documentos_legales_vehiculo`
--
ALTER TABLE `documentos_legales_vehiculo`
  ADD PRIMARY KEY (`id_documento`),
  ADD KEY `fk_doc_tipo` (`id_tipo_doc`),
  ADD KEY `idx_docs_vehiculo` (`id_vehiculo`,`fecha_vencimiento`);

--
-- Indices de la tabla `lecciones`
--
ALTER TABLE `lecciones`
  ADD PRIMARY KEY (`id_leccion`),
  ADD KEY `fk_leccion_curso` (`id_curso`);

--
-- Indices de la tabla `log_scraper`
--
ALTER TABLE `log_scraper`
  ADD PRIMARY KEY (`id_log`);

--
-- Indices de la tabla `mantenimientos_vehiculo`
--
ALTER TABLE `mantenimientos_vehiculo`
  ADD PRIMARY KEY (`id_mantenimiento`),
  ADD KEY `fk_mant_vehiculo` (`id_vehiculo`),
  ADD KEY `fk_mant_tipo` (`id_tipo_mant`);

--
-- Indices de la tabla `marcas_vehiculo`
--
ALTER TABLE `marcas_vehiculo`
  ADD PRIMARY KEY (`id_marca`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `municipios`
--
ALTER TABLE `municipios`
  ADD PRIMARY KEY (`id_municipio`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `codigo_dane` (`codigo_dane`);

--
-- Indices de la tabla `normas_transito`
--
ALTER TABLE `normas_transito`
  ADD PRIMARY KEY (`id_norma`),
  ADD KEY `fk_norma_cat_vehiculo` (`id_categoria_vehiculo`),
  ADD KEY `fk_norma_creador` (`creado_por`),
  ADD KEY `idx_normas_categoria` (`id_categoria`);

--
-- Indices de la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id_noticia`),
  ADD KEY `fk_noticia_creador` (`creado_por`),
  ADD KEY `idx_noticias_publicadas` (`publicada`,`fecha_publicacion`);

--
-- Indices de la tabla `noticias_favoritas`
--
ALTER TABLE `noticias_favoritas`
  ADD PRIMARY KEY (`id_usuario`,`id_noticia`),
  ADD KEY `fk_nf_noticia` (`id_noticia`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `fk_notif_tipo` (`id_tipo_notif`),
  ADD KEY `idx_notif_usuario` (`id_usuario`,`leida`);

--
-- Indices de la tabla `pico_y_placa`
--
ALTER TABLE `pico_y_placa`
  ADD PRIMARY KEY (`id_pico_placa`),
  ADD UNIQUE KEY `uq_pp` (`id_municipio`,`id_categoria`,`fecha`),
  ADD KEY `fk_pp_categoria` (`id_categoria`),
  ADD KEY `idx_pp_fecha` (`fecha`,`id_municipio`),
  ADD KEY `id_log` (`id_log`);

--
-- Indices de la tabla `puntos_criticos`
--
ALTER TABLE `puntos_criticos`
  ADD PRIMARY KEY (`id_punto`),
  ADD KEY `fk_punto_municipio` (`id_municipio`);

--
-- Indices de la tabla `puntuacion_conductor`
--
ALTER TABLE `puntuacion_conductor`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `rutas_favoritas`
--
ALTER TABLE `rutas_favoritas`
  ADD PRIMARY KEY (`id_ruta`),
  ADD KEY `fk_ruta_usuario` (`id_usuario`),
  ADD KEY `fk_ruta_origen` (`id_origen`),
  ADD KEY `fk_ruta_destino` (`id_destino`);

--
-- Indices de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD PRIMARY KEY (`id_sesion`),
  ADD KEY `fk_sesion_usuario` (`id_usuario`);

--
-- Indices de la tabla `tipos_combustible`
--
ALTER TABLE `tipos_combustible`
  ADD PRIMARY KEY (`id_combustible`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `tipos_documento_legal`
--
ALTER TABLE `tipos_documento_legal`
  ADD PRIMARY KEY (`id_tipo_doc`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `tipos_emergencia`
--
ALTER TABLE `tipos_emergencia`
  ADD PRIMARY KEY (`id_tipo`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `tipos_mantenimiento`
--
ALTER TABLE `tipos_mantenimiento`
  ADD PRIMARY KEY (`id_tipo_mant`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `tipos_notificacion`
--
ALTER TABLE `tipos_notificacion`
  ADD PRIMARY KEY (`id_tipo_notif`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `ubicaciones_favoritas`
--
ALTER TABLE `ubicaciones_favoritas`
  ADD PRIMARY KEY (`id_ubicacion`),
  ADD KEY `fk_ubic_usuario` (`id_usuario`),
  ADD KEY `fk_ubic_municipio` (`id_municipio`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_usuario_rol` (`id_rol`);

--
-- Indices de la tabla `usuario_distintivo`
--
ALTER TABLE `usuario_distintivo`
  ADD PRIMARY KEY (`id_usuario`,`id_distintivo`),
  ADD KEY `fk_ud_distintivo` (`id_distintivo`);

--
-- Indices de la tabla `usuario_leccion`
--
ALTER TABLE `usuario_leccion`
  ADD PRIMARY KEY (`id_usuario`,`id_leccion`),
  ADD KEY `fk_ul_leccion` (`id_leccion`),
  ADD KEY `idx_usuario_leccion` (`id_usuario`);

--
-- Indices de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD PRIMARY KEY (`id_vehiculo`),
  ADD UNIQUE KEY `placa` (`placa`),
  ADD KEY `fk_vehiculo_categoria` (`id_categoria`),
  ADD KEY `fk_vehiculo_marca` (`id_marca`),
  ADD KEY `fk_vehiculo_combustible` (`id_combustible`),
  ADD KEY `idx_vehiculos_usuario` (`id_usuario`),
  ADD KEY `idx_vehiculos_placa` (`placa`);

--
-- Indices de la tabla `vehiculo_ruta`
--
ALTER TABLE `vehiculo_ruta`
  ADD PRIMARY KEY (`id_vehiculo`,`id_ruta`),
  ADD KEY `fk_vr_ruta` (`id_ruta`);

--
-- Indices de la tabla `zonas_exentas`
--
ALTER TABLE `zonas_exentas`
  ADD PRIMARY KEY (`id_zona`),
  ADD KEY `fk_zona_municipio` (`id_municipio`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias_norma`
--
ALTER TABLE `categorias_norma`
  MODIFY `id_categoria_norma` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias_vehiculo`
--
ALTER TABLE `categorias_vehiculo`
  MODIFY `id_categoria` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id_curso` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `directorio_emergencias`
--
ALTER TABLE `directorio_emergencias`
  MODIFY `id_emergencia` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `distintivos`
--
ALTER TABLE `distintivos`
  MODIFY `id_distintivo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `documentos_legales_vehiculo`
--
ALTER TABLE `documentos_legales_vehiculo`
  MODIFY `id_documento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `lecciones`
--
ALTER TABLE `lecciones`
  MODIFY `id_leccion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `log_scraper`
--
ALTER TABLE `log_scraper`
  MODIFY `id_log` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mantenimientos_vehiculo`
--
ALTER TABLE `mantenimientos_vehiculo`
  MODIFY `id_mantenimiento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `marcas_vehiculo`
--
ALTER TABLE `marcas_vehiculo`
  MODIFY `id_marca` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `municipios`
--
ALTER TABLE `municipios`
  MODIFY `id_municipio` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `normas_transito`
--
ALTER TABLE `normas_transito`
  MODIFY `id_norma` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `noticias`
--
ALTER TABLE `noticias`
  MODIFY `id_noticia` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pico_y_placa`
--
ALTER TABLE `pico_y_placa`
  MODIFY `id_pico_placa` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `puntos_criticos`
--
ALTER TABLE `puntos_criticos`
  MODIFY `id_punto` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rutas_favoritas`
--
ALTER TABLE `rutas_favoritas`
  MODIFY `id_ruta` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipos_combustible`
--
ALTER TABLE `tipos_combustible`
  MODIFY `id_combustible` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipos_documento_legal`
--
ALTER TABLE `tipos_documento_legal`
  MODIFY `id_tipo_doc` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipos_emergencia`
--
ALTER TABLE `tipos_emergencia`
  MODIFY `id_tipo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipos_mantenimiento`
--
ALTER TABLE `tipos_mantenimiento`
  MODIFY `id_tipo_mant` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipos_notificacion`
--
ALTER TABLE `tipos_notificacion`
  MODIFY `id_tipo_notif` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ubicaciones_favoritas`
--
ALTER TABLE `ubicaciones_favoritas`
  MODIFY `id_ubicacion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  MODIFY `id_vehiculo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `zonas_exentas`
--
ALTER TABLE `zonas_exentas`
  MODIFY `id_zona` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD CONSTRAINT `fk_curso_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `directorio_emergencias`
--
ALTER TABLE `directorio_emergencias`
  ADD CONSTRAINT `fk_em_municipio` FOREIGN KEY (`id_municipio`) REFERENCES `municipios` (`id_municipio`),
  ADD CONSTRAINT `fk_em_tipo` FOREIGN KEY (`id_tipo`) REFERENCES `tipos_emergencia` (`id_tipo`);

--
-- Filtros para la tabla `documentos_legales_vehiculo`
--
ALTER TABLE `documentos_legales_vehiculo`
  ADD CONSTRAINT `fk_doc_tipo` FOREIGN KEY (`id_tipo_doc`) REFERENCES `tipos_documento_legal` (`id_tipo_doc`),
  ADD CONSTRAINT `fk_doc_vehiculo` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculos` (`id_vehiculo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `lecciones`
--
ALTER TABLE `lecciones`
  ADD CONSTRAINT `fk_leccion_curso` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`) ON DELETE CASCADE;

--
-- Filtros para la tabla `mantenimientos_vehiculo`
--
ALTER TABLE `mantenimientos_vehiculo`
  ADD CONSTRAINT `fk_mant_tipo` FOREIGN KEY (`id_tipo_mant`) REFERENCES `tipos_mantenimiento` (`id_tipo_mant`),
  ADD CONSTRAINT `fk_mant_vehiculo` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculos` (`id_vehiculo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `normas_transito`
--
ALTER TABLE `normas_transito`
  ADD CONSTRAINT `fk_norma_cat_vehiculo` FOREIGN KEY (`id_categoria_vehiculo`) REFERENCES `categorias_vehiculo` (`id_categoria`),
  ADD CONSTRAINT `fk_norma_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_norma` (`id_categoria_norma`),
  ADD CONSTRAINT `fk_norma_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD CONSTRAINT `fk_noticia_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `noticias_favoritas`
--
ALTER TABLE `noticias_favoritas`
  ADD CONSTRAINT `fk_nf_noticia` FOREIGN KEY (`id_noticia`) REFERENCES `noticias` (`id_noticia`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_nf_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `fk_notif_tipo` FOREIGN KEY (`id_tipo_notif`) REFERENCES `tipos_notificacion` (`id_tipo_notif`),
  ADD CONSTRAINT `fk_notif_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pico_y_placa`
--
ALTER TABLE `pico_y_placa`
  ADD CONSTRAINT `fk_pp_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_vehiculo` (`id_categoria`),
  ADD CONSTRAINT `fk_pp_municipio` FOREIGN KEY (`id_municipio`) REFERENCES `municipios` (`id_municipio`),
  ADD CONSTRAINT `pico_y_placa_ibfk_1` FOREIGN KEY (`id_log`) REFERENCES `log_scraper` (`id_log`);

--
-- Filtros para la tabla `puntos_criticos`
--
ALTER TABLE `puntos_criticos`
  ADD CONSTRAINT `fk_punto_municipio` FOREIGN KEY (`id_municipio`) REFERENCES `municipios` (`id_municipio`);

--
-- Filtros para la tabla `puntuacion_conductor`
--
ALTER TABLE `puntuacion_conductor`
  ADD CONSTRAINT `fk_pc_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `rutas_favoritas`
--
ALTER TABLE `rutas_favoritas`
  ADD CONSTRAINT `fk_ruta_destino` FOREIGN KEY (`id_destino`) REFERENCES `ubicaciones_favoritas` (`id_ubicacion`),
  ADD CONSTRAINT `fk_ruta_origen` FOREIGN KEY (`id_origen`) REFERENCES `ubicaciones_favoritas` (`id_ubicacion`),
  ADD CONSTRAINT `fk_ruta_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD CONSTRAINT `fk_sesion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ubicaciones_favoritas`
--
ALTER TABLE `ubicaciones_favoritas`
  ADD CONSTRAINT `fk_ubic_municipio` FOREIGN KEY (`id_municipio`) REFERENCES `municipios` (`id_municipio`),
  ADD CONSTRAINT `fk_ubic_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);

--
-- Filtros para la tabla `usuario_distintivo`
--
ALTER TABLE `usuario_distintivo`
  ADD CONSTRAINT `fk_ud_distintivo` FOREIGN KEY (`id_distintivo`) REFERENCES `distintivos` (`id_distintivo`),
  ADD CONSTRAINT `fk_ud_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuario_leccion`
--
ALTER TABLE `usuario_leccion`
  ADD CONSTRAINT `fk_ul_leccion` FOREIGN KEY (`id_leccion`) REFERENCES `lecciones` (`id_leccion`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ul_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD CONSTRAINT `fk_vehiculo_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_vehiculo` (`id_categoria`),
  ADD CONSTRAINT `fk_vehiculo_combustible` FOREIGN KEY (`id_combustible`) REFERENCES `tipos_combustible` (`id_combustible`),
  ADD CONSTRAINT `fk_vehiculo_marca` FOREIGN KEY (`id_marca`) REFERENCES `marcas_vehiculo` (`id_marca`),
  ADD CONSTRAINT `fk_vehiculo_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `vehiculo_ruta`
--
ALTER TABLE `vehiculo_ruta`
  ADD CONSTRAINT `fk_vr_ruta` FOREIGN KEY (`id_ruta`) REFERENCES `rutas_favoritas` (`id_ruta`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_vr_vehiculo` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculos` (`id_vehiculo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `zonas_exentas`
--
ALTER TABLE `zonas_exentas`
  ADD CONSTRAINT `fk_zona_municipio` FOREIGN KEY (`id_municipio`) REFERENCES `municipios` (`id_municipio`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
