AGENTS.MD — Daxe Project Specifications & AI Agent Guidelines
Este documento define la arquitectura general, las reglas de negocio, los estándares de diseño y el comportamiento esperado para cualquier agente de IA o desarrollador que colabore en la construcción de DAXE.

1. Resumen del Proyecto y Objetivo
DAXE es una aplicación web centrada en la movilidad urbana y la gestión del transporte regional (Valle de Aburrá). Su objetivo principal es ofrecer a los usuarios información en tiempo real sobre normativa vial, restricción vehicular (Pico y Placa), herramientas de enrutamiento y asistencia en el desplazamiento cotidiano.

2. Arquitectura de Software y Stack Tecnológico
El proyecto está estructurado bajo el patrón Model-View-Controller (MVC) con un desacoplamiento entre frontend y backend:

Frontend: React + JavaScript (JS) + Tailwind CSS.

Enrutamiento Frontend: Routing dinámico basado en componentes (React Router DOM / HashRouter) gestionando estados de vista SPA (Single Page Application).

Backend / API: PHP en arquitectura MVC para el procesamiento de lógica de negocio en servidor y middleware de comunicación.

Base de Datos & Auth: Supabase (PostgreSQL, Autenticación, Realtime, Row Level Security).

Estructura de Directorios Recomendada
Plaintext
daxe/
├── agents.md
├── backend/                  # Servidor PHP (MVC)
│   ├── config/               # Conexión Supabase / Variables de entorno
│   ├── controllers/          # Lógica de endpoints y procesamiento
│   ├── models/               # Modelos de datos e integración con Supabase DB
│   └── index.php             # Router principal API PHP
├── frontend/                 # React App
│   ├── src/
│   │   ├── components/       # Componentes reutilizables (UI, Modales, Nav)
│   │   ├── context/          # Estado global (AuthContext, ThemeContext)
│   │   ├── hooks/            # Custom Hooks (usePicoYPlaca, useRoute)
│   │   ├── pages/            # Vistas principales del router
│   │   ├── routes/           # Configuración del ruteador dinámico
│   │   └── styles/           # Archivos CSS globales y config Tailwind
└── docs/                     # Documentación técnica adicional
3. Reglas de Negocio del Sistema
Gestión de Restricción Vehicular (Pico y Placa):

El sistema debe calcular y mostrar dinámicamente la restricción del día según el tipo de vehículo (particulares, taxis, motos de 2 y 4 tiempos) y el último/primer dígito de la placa.

Las alertas deben considerar los horarios de exención y zonas de cobertura vigentes en la subregión (p. ej., Vías del Río, conectores corregimentales).

Autenticación y Sesiones:

Integración nativa con Supabase Auth.

Control de roles: Usuario Registrado (guarda vehículos, rutas frecuentes, alertas personalizadas) y Invitado (consulta rápida de restricción y mapas).

Uso estricto de Políticas de Seguridad a nivel de fila (RLS - Row Level Security) en la base de datos PostgreSQL de Supabase.

Mapeo y Enrutamiento:

Cálculo interactivo de rutas considerando congestión, incidentes viales reportados e impedimentos normativos del vehículo configurado.

Respuestas API & Manejo de Errores:

Toda respuesta del backend PHP debe responder con un estándar JSON coherente: { "success": boolean, "data": array|object, "message": string }.

4. Sistema de Diseño y Paletas de Colores (Themes)
El sistema de diseño soporta dos modos visuales (Light / Dark) que marcan la identidad distintiva de la marca DAXE mediante acentos púrpura y azul:

4.1. Dark Palette (Tema Oscuro)
Elemento	Color / Hex	Descripción
Fondo Principal	#090A0F / #000000	Negro profundo para contraste máximo.
Bordes / Delineados de Contenedores	#6D28D9 / #8B5CF6	Púrpura/Violeta vibrante para marcar límites de cards y paneles.
Detalles y Acentos Visuales	#2563EB / #3B82F6	Azul eléctrico para botones de acción secundaria, badges o estados.
Texto Principal	#F9FAFB	Blanco / Gris muy claro para lectura óptima.
4.2. Light Palette (Tema Claro)
Elemento	Color / Hex	Descripción
Fondo Principal	#FAFAFA / #F5F5DC	Tonos blancos limpios con matices beige cálidos.
Texto / Tipografía	#111827 / #1F2937	Contraste alto en tonos negro/gris oscuro.
Delineados / Acentos de Marca	#7C3AED / #9333EA	Púrpura y violeta corporativo para bordes, branding e interactividad.
Superficies de Contenedores	#FFFFFF / #F3F4F6	Blanco neutro con bordes definidos.
Configuración Sugerida (tailwind.config.js)
JavaScript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        daxe: {
          darkBg: '#090a0f',
          lightBg: '#fbfbf9',
          purple: '#7c3aed',
          purpleBright: '#8b5cf6',
          blueAccent: '#3b82f6',
          beige: '#f5f5dc',
        }
      }
    }
  }
}
5. Instrucciones Directas para Agentes de IA
Cualquier modelo de IA que trabaje en este repositorio debe cumplir las siguientes reglas:

Mantener la Arquitectura: No mezclar la lógica de base de datos directamente en los componentes de React; las consultas complejas o reglas de negocio de backend deben canalizarse mediante la capa MVC (PHP / Controllers / Supabase SDK).

Consistencia de Clases: Usar Tailwind CSS para la aplicación de las paletas. Asegurarse de que cada contenedor o Card incluya las clases correspondientes para bordes púrpura (border-purple-600 o dark:border-violet-500) y acentos en azul (text-blue-500).

Código Modular: Crear componentes funcionales pequeños y reutilizables en React. Evitar archivos monolíticos.

Manejo de Ruteo: Mantener las rutas limpias en el frontend mediante un mapa de rutas centralizado y vistas dinámicas (Lazy Loading si el bundle crece).

