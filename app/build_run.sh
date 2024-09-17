#! /bin/bash

pnpm prisma:generate &&
pnpm prisma:migrate-prod &&
pnpm prisma:push &&

pnpm build && 
pnpm start