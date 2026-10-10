# DAXE_DRIVE

Aplicación de movilidad urbana con React/Vite, API PHP MVC y Supabase.

## Requisitos

- Node.js y npm.
- PHP 8.1 o posterior, con las extensiones `curl` y `json` habilitadas.
- Un proyecto Supabase configurado.

## Configurar Supabase y PHP

1. Abre el archivo local `backend/.env` (ya creado a partir de la plantilla) y reemplaza los valores que empiezan con `REEMPLAZA_` por los datos del proyecto. Puedes obtenerlos en el panel de Supabase, en la configuración de API del proyecto.
2. Mantén `SUPABASE_SERVICE_ROLE_KEY` solo en el backend y no la compartas ni la subas al repositorio; `/.gitignore` ya excluye `backend/.env`.
3. Ejecuta las migraciones de `supabase/migrations` en orden cronológico desde el SQL Editor de Supabase. La migración `20251012000000_favorite_routes.sql` crea las rutas favoritas y sus políticas RLS.

## Ejecutar localmente en Windows

Abre dos terminales en VS Code y deja ambas abiertas.

En la primera, con la raíz del repositorio como directorio actual, inicia la API PHP:

```powershell
php -S 127.0.0.1:8000 -t backend backend/index.php
```

En la segunda, inicia React/Vite:

```powershell
Set-Location .\daxe
npm install
npm run dev
```

Abre la URL local que Vite muestre, normalmente `http://localhost:5173`. Usa `localhost` para que coincida con el origen CORS configurado en el backend.

## Probar el planificador

1. Crea una cuenta o inicia sesión.
2. En el mapa, escribe origen y destino (por ejemplo, `Medellín, Colombia` y `El Poblado, Medellín, Colombia`) y selecciona **Calcular ruta**.
3. Revisa el trazado, la distancia y el tiempo estimado. Los valores se copian al formulario **Rutas favoritas**; selecciona **Guardar ruta** para persistirlos en Supabase.

El endpoint público `POST /api/routes/plan` hace la búsqueda de direcciones con Nominatim y calcula rutas en automóvil con OSRM. Requiere conexión a Internet; sus tiempos son estimados y no incorporan tráfico en vivo. Los servicios públicos pueden limitar uso y no ofrecen garantías de disponibilidad para producción.

## Verificaciones de frontend

Desde `daxe`, los comandos de prueba y compilación son:

```powershell
node tests/routePlanningService.test.mjs
node tests/favoriteRoutes.test.mjs
npm run build
```
