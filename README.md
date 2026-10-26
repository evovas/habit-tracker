# habit-tracker

Монорепозиторий трекера привычек (pnpm workspace).

| Путь       | Что                                   |
| ---------- | ------------------------------------- |
| `apps/api` | Бэкенд: Node.js, Fastify, Drizzle     |
| `apps/web` | Фронтенд: React, Vite, FSD            |

```bash
pnpm install       # одна установка на весь репозиторий
pnpm dev           # api и web параллельно
pnpm dev:api
pnpm dev:web
```

Docker для бэкенда: `cd apps/api && pnpm docker:up` (build context — корень репозитория).
