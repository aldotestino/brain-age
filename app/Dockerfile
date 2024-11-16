FROM node:20 AS base

ARG DATABASE_URL
ARG MODEL_API_URL
ENV NEXT_TELEMETRY_DISABLED 1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app

RUN --mount=type=cache,id=s/5f85beb7-63bd-4bda-9bdf-58d1dd7597b8-pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm install --frozen-lockfile

RUN pnpm prisma:generate
RUN pnpm prisma:migrate-prod

RUN pnpm build
CMD ["pnpm", "start"]