FROM node:20 AS base
ARG DATABASE_URL
ENV RAILWAY_SERVICE_ID 5f85beb7-63bd-4bda-9bdf-58d1dd7597b8
ENV NEXT_TELEMETRY_DISABLED 1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=s/${RAILWAY_SERVICE_ID}-pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=s/${RAILWAY_SERVICE_ID}-pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm prisma:generate
RUN pnpm prisma:migrate-prod
RUN pnpm prisma:push
RUN pnpm build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
CMD [ "pnpm", "start" ]