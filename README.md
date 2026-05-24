# Encuestas Serverless

Aplicación web de encuestas en vivo construida con **Next.js**, **Supabase** y **Vercel**.

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
- Creación de encuestas con opciones personalizadas
- Votación en encuestas (un voto por usuario por encuesta)
- Visualización de resultados en tiempo real con barras de progreso
- Dashboard con estadísticas del usuario
- Eliminación de encuestas propias

## Estructura del Repositorio

```
main         → Rama principal (funcional y desplegada)
develop      → Rama de integración
alumno1/frontend → Geraldine - Frontend (páginas y componentes)
alumno2/backend  → Tomas - Backend (acciones server, API, Supabase)
```

## Autores

- **Tomas Braun** ([tomibraunn](https://github.com/tomibraunn)) — Backend (Supabase schema, server actions, API routes)
- **Geraldine** (49374998@est.ort.edu.ar) — Frontend (páginas, componentes, layout)

## Primeros pasos

```bash
# Clonar
git clone https://github.com/tomibraunn/tp2frontbraunoriolo
cd tp2frontbraunoriolo

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Completar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY

# Ejecutar migración en Supabase SQL Editor
# (ver supabase/migration.sql)

# Iniciar desarrollo
npm run dev
```

## Despliegue

Conectá el repositorio a [Vercel](https://vercel.com) y configurá las variables de entorno. El deploy es automático en cada push a `main`.
