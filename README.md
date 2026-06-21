# Gestor de Proyectos

Aplicación serverless para gestión de proyectos construida con **Next.js**, **Supabase** y **Vercel**.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Next.js 16 (Turbopack) |
| Estilos | Tailwind CSS |
| Autenticación | Supabase Auth |
| Base de datos | Supabase (PostgreSQL) |
| Despliegue | Vercel |

## Funcionalidades

- Registro, inicio y cierre de sesión de usuarios
- Creación de proyectos con título y descripción
- Edición y eliminación de proyectos propios
- Dashboard con estadísticas del usuario

## Estructura del Repositorio

```
main              → Rama principal (funcional y desplegada)
develop           → Rama de integración
feature/nombre    → Nuevas funcionalidades
fix/nombre        → Correcciones de bugs
```

### Convención de branches

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Feature | `feature/nombre-feature` | `feature/autenticacion` |
| Fix | `fix/nombre-bug` | `fix/error-login` |

Ningún cambio se mergea directo a `main` ni a `develop`. Todo pasa por un Pull
Request con al menos una revisión del otro integrante del equipo.

## Autores

- **Tomas Braun** ([tomibraunn](https://github.com/tomibraunn)) — Backend (Supabase schema, server actions)
- **Geraldine** (49374998@est.ort.edu.ar) — Frontend (páginas, componentes, layout)

## Primeros pasos

```bash
git clone https://github.com/tomibraunn/tp2frontbraunoriolo
cd tp2frontbraunoriolo
npm install
cp .env.example .env.local
# Completar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev        # Desarrollo local
npm run build      # Build de producción
npm run lint       # ESLint
npm test           # Tests unitarios (Vitest)
npm run test:e2e   # Tests E2E (Playwright)
npm run test:all   # Unitarios + E2E
```

## CI/CD

Pipeline en GitHub Actions: `lint` → `test` → `build` → `deploy`

Cada push o PR a `main` ejecuta el pipeline. El deploy a producción solo ocurre
si todos los pasos anteriores pasan.

### Secrets requeridas en GitHub

| Secret | Descripción |
|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase |
| `VERCEL_TOKEN` | Token de Vercel para deploy |

## URL de producción

<!-- TODO: actualizar con la URL real de Vercel -->
`https://<proyecto>.vercel.app`

## Despliegue

Conectá el repositorio a [Vercel](https://vercel.com) y configurá las variables de entorno.
