# Estudia+

Aplicación web ficticia para organizar asignaturas, tareas, evaluaciones y el calendario académico. Funciona completamente en el navegador, sin backend ni APIs externas.

## Requisitos

- Node.js 20 o superior
- npm

## Instalación y ejecución

```bash
npm install
npm run dev
```

La aplicación queda disponible en la URL que indique Vite, normalmente `http://localhost:5173`.

Para ingresar, usa cualquier usuario y contraseña no vacíos.

## Scripts

```bash
npm run dev        # servidor de desarrollo
npm run build      # typecheck + build de producción
npm run preview    # vista previa del build
npm run lint       # análisis con ESLint
npm run typecheck  # verificación de TypeScript
npm test           # pruebas en modo watch
npm run test:run   # pruebas en modo CI
```

## Funcionalidades

- Inicio de sesión simulado, cierre de sesión y rutas protegidas.
- Dashboard con resumen académico, próximos eventos, promedios y gráfico por asignatura.
- Gestión de perfil del estudiante.
- CRUD de asignaturas con eliminación en cascada de tareas y evaluaciones.
- CRUD de tareas con búsqueda, filtros, orden, prioridades y detección de vencimientos.
- CRUD de evaluaciones con tipos, estados, calificaciones y promedio.
- Calendario mensual, semanal y de agenda, con filtros y creación de tareas desde una fecha.
- Datos de demostración, restauración desde el perfil y persistencia local.
- Diseño responsive con Material UI y notificaciones de feedback.

## Persistencia

Los datos se guardan en `localStorage`:

- `estudia-plus:data:v1`: asignaturas, tareas, evaluaciones y perfil.
- `estudia-plus:session:v1`: sesión simulada.

La opción «Mantener mi sesión» controla si la sesión se persiste entre recargas. Puedes restaurar los datos demo desde el perfil o limpiar el almacenamiento del navegador.

## Estructura

```text
src/
  app/          Configuración de rutas, tema y aplicación
  components/   Componentes comunes, layout y feedback
  data/         Datos ficticios iniciales
  features/     Módulos por dominio (auth, dashboard, tareas, etc.)
  services/     Repositorios de datos y almacenamiento local
  test/         Configuración y utilidades de pruebas
  types/        Tipos y enums del dominio
  utils/        Utilidades académicas, fechas, constantes e IDs
```

## Pruebas

La suite usa Vitest, React Testing Library y jsdom. Cubre autenticación, navegación, asignaturas, tareas, evaluaciones, perfil, calendario y lógica académica.

```bash
npm run test:run
```

## Alcance

- Sin autenticación real, backend ni servicios externos.
- Los datos y usuarios son ficticios y viven en el navegador.
- Las fechas de demostración son relativas a la fecha actual.
# Edtudia_app
# Edtudia_app
# EstudiaPlus-App
