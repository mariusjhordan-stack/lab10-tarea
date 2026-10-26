# Gestión de productos

Prototipo de catálogo comercial desarrollado con React, Vite, Tailwind CSS y
componentes reutilizables de shadcn/ui. Permite consultar cinco productos de
ejemplo y registrar nuevos productos con código automático y validación.

## Requisitos

- Node.js
- npm

## Ejecución

```sh
npm install
npm run dev
```

## Comandos disponibles

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: genera la compilación de producción.
- `npm run preview`: previsualiza la compilación.
- `npm run lint`: ejecuta ESLint.

Los productos se mantienen únicamente en el estado de React durante la sesión.
No se conectan a un servidor ni se guardan de forma permanente; al recargar la
página se vuelven a mostrar los datos de ejemplo.
