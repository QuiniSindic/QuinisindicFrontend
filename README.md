# Quinisindic Frontend

Frontend de Quinisindic, una aplicacion web para seguir eventos deportivos, consultar clasificaciones y guardar predicciones de la comunidad.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- HeroUI
- TanStack Query
- Supabase SSR
- next-themes

## Gestor de paquetes

- El proyecto usa `pnpm` como gestor oficial.
- El lockfile fuente de verdad es `pnpm-lock.yaml`.
- No se debe regenerar `package-lock.json` ni mezclar comandos de `npm install`.

## Estado actual

- La app principal ya usa enfoque server-first en las rutas de listados y detalle.
- La capa de datos de Supabase esta separada por runtime en `src/services/server`, `src/services/browser` y `src/services/shared`.
- Los tipos de base de datos viven en `src/types/database` y se separan de los tipos de dominio en `src/types/domain`.
- `pnpm lint`, `pnpm check:ts` y `pnpm build` pasan.
- No hay suite de tests automatizados todavia.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm check:ts
pnpm format
pnpm supabase:types
```

## Variables de entorno

El proyecto necesita al menos estas variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Notas:
- `src/utils/supabase/client.ts` y `src/utils/supabase/server.ts` usan `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.
- `src/app/auth/callback/route.ts` usa `NEXT_PUBLIC_SUPABASE_ANON_KEY` para intercambiar el codigo OAuth por sesion.
- `pnpm supabase:types` asume que el proyecto de Supabase ya esta enlazado localmente con la CLI.

Para despliegue en Vercel necesitas tambien:

```env
NEXT_PUBLIC_BACKEND_URL=https://tu-backend.example.com
NEXT_PUBLIC_SITE_URL=https://tu-frontend.vercel.app
```

Notas:
- `NEXT_PUBLIC_BACKEND_URL` debe apuntar al FastAPI `v2` desplegado.
- Si no se define, la app cae a `http://localhost:8000`, que solo sirve en local.

## Desarrollo local

1. Instala dependencias.

```bash
pnpm install
```

2. Crea tu archivo `.env` con las variables de Supabase.

3. Arranca el proyecto.

```bash
pnpm dev
```

4. Abre `http://localhost:3000`.

## Despliegue

Despliegue beta recomendado:

1. desplegar `Frontend` en Vercel
2. desplegar `Python-backend` por separado
3. configurar en Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BACKEND_URL=https://tu-backend.example.com
NEXT_PUBLIC_SITE_URL=https://tu-frontend.vercel.app
```

Smoke check minimo despues del deploy:

1. abrir `/home`
2. abrir `/events`
3. abrir `/results`
4. abrir `/leaderboard`
5. abrir `/predictions`
6. validar login y callback OAuth

## Estructura relevante

```text
src/
  app/
    (auth)/
    (main)/
    auth/
  components/
  hooks/
  services/
    browser/
    server/
    shared/
  types/
    database/
    domain/
  utils/
```

## Arquitectura de datos

### Server-first

Las lecturas iniciales de las paginas principales se resuelven en Server Components:

- `/home`
- `/events`
- `/results`
- `/leaderboard`
- `/predictions`
- `/event/[slug]`

React Query se mantiene para refresco en cliente, polling y estados interactivos.

### Supabase por runtime

- `src/services/server/*`: lecturas en servidor y datos iniciales para RSC.
- `src/services/browser/*`: hooks y acciones cliente.
- `src/services/shared/*`: mappers y logica pura reutilizable.

Regla de trabajo:
- componentes server, layouts server y route handlers solo deben importar `server/*`
- hooks y componentes cliente solo deben importar `browser/*`
- logica sin runtime puede ir en `shared/*`

### Tipos DB vs dominio

- `src/types/database/generated.ts`: contrato `Database` alineado con Supabase.
- `src/types/database/index.ts`: helpers como `DbTable`, `DbInsert`, `DbUpdate` y `DbView`.
- `src/types/database/json.ts`: shapes tipados para columnas `jsonb`.
- `src/types/domain/*`: contratos de UI y dominio de la app.

## Navegacion principal

Rutas actuales de la app:

- `/home`
- `/events`
- `/results`
- `/leaderboard`
- `/predictions`
- `/event/[slug]`
- `/profile`
- `/settings`
- `/login`
- `/sign-up`
- `/auth/auth-code-error`

## Filtros y estado

Los filtros principales de eventos, resultados, ranking y predicciones viven en la URL mediante `searchParams`.

Archivos relevantes:
- `src/types/domain/filters.ts`
- `src/utils/domain/filterParams.ts`
- `src/hooks/useEventFiltersNavigation.ts`

## Convenciones del proyecto

- Ejecutar siempre scripts con `pnpm`.
- Priorizar Server Components para lecturas iniciales.
- No mezclar clientes Supabase de browser y server en un mismo servicio.
- Mantener separados tipos DB y tipos de dominio.
- Usar `pnpm lint`, `pnpm check:ts` y `pnpm build` antes de cerrar cambios importantes.
- Regenerar `src/types/database/generated.ts` cuando cambie el schema `public`.

## Deuda tecnica conocida

- Sigue quedando logica de UI hardcodeada en `src/utils/domain/sports.ts`.
- El modelo de competicion todavia no soporta bien formatos mixtos como grupos + eliminatorias.
- Las clasificaciones siguen dependiendo del campo `competitions.standings`.
- Falta una suite de tests.

## Siguientes bloques de trabajo

1. Redisenar el modelo de competicion para grupos, eliminatorias, playoff y series.
2. Normalizar clasificaciones por fase/grupo.
3. Rehacer el bracket sobre stages explicitos.
4. Anadir soporte real para tenis y Formula 1.
5. Implementar un motor de scoring configurable por mercado.
