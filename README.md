# Nexo Comercial

Panel de demostración para gestionar un catálogo e inventario comercial,
desarrollado con React y Vite. Incluye indicadores de existencias y valor,
clasificación por categorías, alta y edición de productos, búsqueda, filtros,
ordenamiento y exportación del catálogo a CSV.

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

Los productos se guardan en el almacenamiento local del navegador y se
mantienen al recargar la página en ese mismo navegador. Esta demostración no
cuenta con servidor, sincronización entre usuarios, autenticación ni una base de
datos compartida; no debe usarse como sistema de inventario de producción.
