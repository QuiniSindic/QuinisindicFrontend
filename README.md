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

## Estado actual

- La app principal ya usa enfoque server-first en las rutas de listados y detalle.
- La capa de datos de Supabase esta separada por runtime en `src/services/server`, `src/services/browser` y `src/services/shared`.
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

- Priorizar Server Components para lecturas iniciales.
- No mezclar clientes Supabase de browser y server en un mismo servicio.
- Mantener los tipos de dominio en `src/types/domain`.
- Usar `pnpm lint`, `pnpm check:ts` y `pnpm build` antes de cerrar cambios importantes.

## Deuda tecnica conocida

- El catalogo de deportes y competiciones sigue parcialmente hardcodeado en `src/utils/domain/sports.ts`.
- El modelo de competicion todavia no soporta bien formatos mixtos como grupos + eliminatorias.
- Las clasificaciones siguen dependiendo del campo `competitions.standings`.
- Falta una suite de tests.

## Siguientes bloques de trabajo

1. Sustituir el catalogo hardcodeado de deportes y competiciones por datos desde Supabase.
2. Redisenar el modelo de competicion para grupos, eliminatorias, playoff y series.
3. Normalizar clasificaciones por fase/grupo.
4. Anadir soporte real para tenis y Formula 1.
5. Implementar un motor de scoring configurable por mercado.
