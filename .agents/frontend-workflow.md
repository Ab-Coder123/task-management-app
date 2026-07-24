# Frontend Workflow Standard & Engineering Guide

This workflow defines the mandatory frontend engineering standards for Next.js 14, React 18, Zustand, TanStack Query, and UI design guidelines.

---

## 1. Frontend Architecture & API Normalization

### Layer Separation
- **Pages (`src/app/`)**: Route rendering, layout wrappers, top-level state orchestration.
- **Components (`src/components/`)**: Reusable, isolated UI components. Never mix API fetching directly in presentational components.
- **Hooks (`src/lib/hooks/`)**: Custom React hooks & TanStack Query mutations/queries.
- **API Mappers (`src/lib/api/`)**: Centralized HTTP client (`apiFetch`) and bidirectional payload normalizers (`mapRawTask`, `toBackendTask`).
- **Types (`src/lib/types/`)**: TypeScript interface definitions for API responses and UI models.
- **Store (`src/lib/store/`)**: Global application state (e.g. Zustand `authStore`).

### Data Normalization & Adapter Pattern
- Backend API responses MUST be normalized in `src/lib/api/` before reaching hooks or components.
- Handle paginated payloads `{ tasks: [...], pagination: {...} }` and legacy arrays transparently in API adapters.
- Preserve optional fields gracefully using default fallbacks (`?? []`, `?? ''`).

---

## 2. React & State Management Rules

### State Scope
- Use **Local Component State (`useState`)** for UI toggles, draft inputs, modal visibility, and local form inputs.
- Use **Zustand (`useAuthStore`)** ONLY for global session/user auth state.
- Use **TanStack Query (`useQuery` / `useMutation`)** for all server state caching and synchronization.
- **Invalidation Strategy**: Mutating actions must explicitly call `queryClient.invalidateQueries({ queryKey: ['...'] })` to synchronize UI with server state.

### Re-render & Performance Optimization
- Avoid unnecessary re-renders: Memoize complex computations using `useMemo` and callbacks using `useCallback` when passed as props to heavy components.
- Ensure unique `key` props for all dynamic list iterations (`.map()`). Never use array index as `key` if list items can be reordered or deleted.

---

## 3. UI/UX & Design Guidelines

### Visual Aesthetics & Tailwind Tokens
- Follow dark mode & glassmorphism aesthetic guidelines.
- Use curated color tokens (`bg-card`, `bg-muted`, `border-border`, `text-foreground`, `text-muted-foreground`) instead of arbitrary raw color codes.
- Support RTL layout natively (`dir="rtl"`, Arabic prose alignment).
- Include hover effects, smooth micro-interactions, and accessible focus outlines.

---

## 4. Mandatory Frontend Verification Checklist
Before completing any frontend task, verify:
- [ ] `npm run build` compiles clean without TypeScript or Next.js errors.
- [ ] No unhandled Promise rejections in async event handlers.
- [ ] Proper loading (`LoadingSpinner`) and error states handled in UI.
- [ ] No direct mutation of state objects or props.
