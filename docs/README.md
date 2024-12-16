# Documentación del Frontend

## Descripción general
Este es el frontend del proyecto, construido con React. Permite a los usuarios (profesores y alumnos) interactuar con la API del backend, mostrar los cursos, gestionar materiales y realizar acciones como la inscripción a cursos y la gestión de sus respuestas a parciales o trabajos prácticos.

## Instalación
2. Instala las dependencias:
   cd frontend_dsw
   pnpm install
3. Inicia el servidor en desarrollo:
   pnpm start:dev
4. Inicia el servidor en produccion:
   pnpm start:prod   

## Notas
La aplicación consume una API RESTful.
La autenticación se maneja con JWT, y los datos se almacenan en un contexto global de React.

## Tests automaticos
Los tests automáticos están configurados con Jest y React Testing Library. Para ejecutar los tests:
pnpm test