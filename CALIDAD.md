# CALIDAD.md — Gestor de Proyectos

Documento de calidad del equipo. Explica las decisiones, herramientas y estrategia
adoptadas para asegurar que cada cambio en el codigo sea validado antes de llegar
a produccion.

---

## Estrategia general

Nuestro enfoque de calidad se basa en tres pilares:

1. **Validacion automatica en cada cambio**: Todo push o PR a `main` dispara un
   pipeline de CI/CD que ejecuta lint, tests unitarios y build. Si algo falla,
   el cambio no avanza. Esto garantiza que nadie, ni por error, suba codigo roto.

2. **Logica de negocio extraida y testeada**: Identificamos las funciones puras
   del sistema (matematicas, validacion, parseo) y las aislamos en modulos
   independientes (`chartUtils`, `pollUtils`). Asi logramos tests rapidos, sin
   dependencias externas, que validan el corazon de la aplicacion.

3. **Flujo critico cubierto con E2E**: El camino principal del usuario (login →
   crear proyecto → verlo) esta cubierto con un test end-to-end que corre sobre
   un navegador real, simulando la experiencia completa.

## Herramientas seleccionadas

| Proposito | Herramienta | Por que |
|-----------|-------------|---------|
| Tests unitarios | **Vitest** | Nativo de Vite, compatible con el ecosistema Next.js, mas rapido que Jest en monorepos y sin configuracion compleja. Soporta ESM out of the box. |
| Tests E2E | **Playwright** | Multi-browser, trazado automatico de errores (trace viewer), mejor integracion con CI que Cypress. Permite simular flujos reales de usuario. |
| Lint | **ESLint** | Ya venia configurado con Next.js. Reglas estrictas de TypeScript y React. |
| CI/CD | **GitHub Actions** | Gratuito para repos publicos, integrado con GitHub, marketplace enorme. Usamos jobs secuenciales: lint → test → build → deploy. |
| Deploy | **Vercel** | Misma plataforma donde ya esta desplegada la app. Deploy automatico desde CI solo si todos los pasos previos pasan. |

Descartamos Jest por ser mas pesado en configuracion con ESM y TypeScript.
Descartamos Cypress porque Playwright ofrece mejor trazado de errores y es mas
rapido en CI al no requerir un proxy intermedio.

## Tests desarrollados

### Tests unitarios — `chartUtils.test.ts`

Validan las funciones matematicas que generan los arcos del grafico de torta:

| Test | Que valida |
|------|------------|
| `polarToCartesian` 0° | Devuelve coordenada superior: `(cx, cy - r)` |
| `polarToCartesian` 90° | Devuelve coordenada derecha: `(cx + r, cy)` |
| `polarToCartesian` 180° | Devuelve coordenada inferior: `(cx, cy + r)` |
| `polarToCartesian` 270° | Devuelve coordenada izquierda: `(cx - r, cy)` |
| `polarToCartesian` 45° | Caso intermedio con verificacion numerica exacta |
| `describeArc` 360° | Arco completo genera path de circulo cerrado |
| `describeArc` < 180° | Arco parcial genera path con `largeArc=0` |
| `describeArc` > 180° | Arco grande genera path con `largeArc=1` |
| `describeArc` desborde | Span >= 360 se trata como circulo completo |

### Tests unitarios — `pollUtils.test.ts`

Validan la logica de parseo y validacion de formularios de creacion de proyectos:

| Test | Que valida |
|------|------------|
| `parseOptions` split | Separa string por comas en array de strings |
| `parseOptions` trim | Elimina espacios sobrantes de cada opcion |
| `parseOptions` empty entries | Filtra entradas vacias (comas finales, espacios) |
| `parseOptions` whitespace only | Descarta entradas que son solo espacios |
| `parseOptions` empty string | String vacio devuelve array vacio |
| `validatePollInput` valido 2 | Titulo + 2 opciones → sin error |
| `validatePollInput` valido 4 | Titulo + 4 opciones → sin error |
| `validatePollInput` sin titulo | Error: "Title and options are required" |
| `validatePollInput` sin opciones | Error: "Title and options are required" |
| `validatePollInput` 1 opcion | Error: "At least 2 options are required" |
| `getUsername` desde email | Extrae "tomas" de "tomas@example.com" |
| `getUsername` con metadata | Prefiere el username del metadata de auth |
| `getUsername` sin nada | Fallback a "user" por defecto |

### Test E2E — `app.spec.ts`

Cubre el flujo principal de la aplicacion:

1. Navega a `/login`
2. Verifica que el formulario de login este presente
3. Completa email y password
4. Verifica redireccion a `/dashboard`
5. Navega a `/polls/create`
6. Completa titulo, descripcion y opciones
7. Envia el formulario
8. Verifica que la nueva entidad se muestre en pantalla

### Ejecucion

```bash
npm test            # Unit tests (Vitest)
npm run test:e2e    # E2E tests (Playwright)
npm run test:all    # Ambos
```

## Casos de uso criticos

Priorizamos proteger con tests estos flujos por su impacto en el usuario:

1. **Parseo y validacion de datos de formulario** (`pollUtils`): Es el punto de
   entrada de datos a la aplicacion. Si el parseo falla, se crean entidades
   corruptas o se rechazan datos validos. Es logica pura, facil de testear y
   de alto impacto.

2. **Generacion del grafico de torta** (`chartUtils`): Las formulas de
   conversion polar a cartesiano son sensibles a errores de redondeo y casos
   borde (angulos negativos, giros completos). Un error aca rompe la
   visualizacion completa del dashboard.

3. **Login → Crear proyecto → Verlo** (E2E): Es el camino feliz del usuario.
   Si este flujo se rompe, la aplicacion deja de ser util. Cubre autenticacion,
   creacion y visualizacion en un solo test integrado.

## Pipeline de CI/CD

### Workflow: `.github/workflows/ci.yml`

| Job | Disparador | Que hace |
|-----|-----------|----------|
| `lint` | Push/PR a `main` | Corre ESLint sobre todo el proyecto |
| `test` | Solo si `lint` paso | Corre `vitest run` (tests unitarios) |
| `build` | Solo si `test` paso | Corre `npm run build` (construye la app) |
| `deploy` | Solo en push a `main` y si `build` paso | Deploy a Vercel con `--prod` |

### Decisiones de diseno

- **Jobs secuenciales, no en paralelo**: Preferimos cortar temprano. Si el lint
  falla, no gastamos minutos de CI corriendo tests. Si los tests fallan, no
  perdemos tiempo buildenado. Cada job es una barrera de calidad.

- **Build con variables de entorno de Supabase**: El build de Next.js requiere
  las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  Se configuran como secrets en GitHub y se inyectan solo en el job `build`.

- **Deploy solo desde `main` y solo en push**: Los PRs no deployan. Solo
  cuando el codigo se mergea a `main` (via push directo o merge de PR) se
  dispara el deploy. Esto evita que branches en desarrollo pisen produccion.

- **Sin E2E en CI por ahora**: Los tests E2E requieren un navegador y una
  instancia de la app corriendo con una base de datos real. Decidimos correrlos
  localmente antes de cada PR y documentar los resultados. Integrarlos en CI
  requeriria una base Supabase de staging, lo cual queda como mejora futura.

## Limitaciones y deuda tecnica

1. **Tests E2E no integrados en CI**: Requieren un entorno completo (app + DB).
   Hoy corren manualmente. La mejora natural es agregar un job de E2E con una
   base Supabase de branch.

2. **Cobertura limitada en server actions**: Las funciones `signup`, `login`,
   `createPoll`, `vote` y `deletePoll` dependen fuertemente de Supabase y
   `next/headers`. Testearlas requeriria mocks complejos o un entorno de
   integracion. Priorizamos extraer y testear la logica pura que contienen.

3. **Sin tests de componentes React**: Los componentes de UI (Navbar, PollCard,
   PollForm) no tienen tests de renderizado. Sabemos que cambios visuales
   podrian romperse sin deteccion automatica. Aceptamos este riesgo porque el
   test E2E cubre parcialmente la interaccion con ellos.

4. **Sin cobertura de estilos visuales**: Tailwind y CSS no tienen validacion
   automatica. Un cambio en clases podria romper el diseno sin que el pipeline
   lo detecte.

5. **Variables de entorno en CI**: Las secrets de Supabase deben configurarse
   manualmente en GitHub. Si no estan, el job `build` falla. Esto esta
   documentado en el README.
