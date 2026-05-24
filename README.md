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
alumno1/frontend  → Geraldine - Frontend (páginas y componentes)
alumno2/backend   → Tomas - Backend (acciones server, Supabase)
```

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

## Despliegue

Conectá el repositorio a [Vercel](https://vercel.com) y configurá las variables de entorno.
