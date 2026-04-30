# Red Light, Green Light

Aplicación web desarrollada con Angular que implementa la lógica del juego "Red Light, Green Light".

---

## Tecnologías utilizadas

- Angular 19
- TypeScript
- RxJS
- PrimeNG
- ESLint + Prettier

---

## Requisitos previos

Antes de ejecutar el proyecto en local, asegúrate de tener instalado:

- Node.js **v22.x** (recomendado)
- npm (incluido con Node)

---

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/DaniValero/red-light-green-light.git
cd red-light-green-light
```

Instala las dependencias:

```bash
npm install
```

---

## Ejecución en local

Para levantar la aplicación en modo desarrollo:

```bash
npm start
```

o equivalente:

```bash
ng serve
```

La aplicación estará disponible en:

```text
http://localhost:4200/
```

---

## Build de producción

Para generar la versión optimizada:

```bash
npm run build
```

Los archivos compilados se generarán en:

```text
dist/red-light-green-light/
```

---

## Tests

Ejecutar tests unitarios:

```bash
npm run test
```

---

## Linting

Analizar el código con ESLint:

```bash
npm run lint
```

---

## Despliegue

El proyecto está configurado para desplegarse automáticamente en GitHub Pages mediante CI/CD al hacer push a la rama `main`.

---

## Notas adicionales

- El proyecto utiliza PrimeNG para componentes UI.
- Se recomienda usar Node LTS para evitar problemas de compatibilidad.
- El despliegue en GitHub Pages usa `base-href` dinámico basado en el nombre del repositorio.
