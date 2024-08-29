#! /bin/bash

yarn prisma:generate && 
yarn prisma:migrate-dev --name init &&
yarn prisma:migrate-prod &&
yarn prisma:push &&

yarn build && 
yarn start