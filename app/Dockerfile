FROM node:20

ARG DATABASE_URL
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .

RUN yarn prisma:generate
RUN yarn prisma:migrate-prod
RUN yarn prisma:push

RUN yarn build
CMD yarn start
