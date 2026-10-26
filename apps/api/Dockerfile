# Build context — корень монорепы (см. docker-compose.yml)
FROM node:24-alpine AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app

# Манифесты всего workspace нужны, чтобы --frozen-lockfile сошёлся с общим lockfile
FROM base AS manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpmfile.cjs ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

FROM manifests AS build
RUN pnpm install --frozen-lockfile --filter ./apps/api
COPY apps/api/tsconfig.json apps/api/tsconfig.build.json ./apps/api/
COPY apps/api/src ./apps/api/src
RUN pnpm --filter ./apps/api build

FROM manifests AS prod-deps
RUN pnpm install --frozen-lockfile --prod --filter ./apps/api

FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api/package.json ./apps/api/
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY apps/api/drizzle ./apps/api/drizzle
WORKDIR /app/apps/api
USER node
EXPOSE 3000
CMD ["node", "--enable-source-maps", "dist/server.js"]
