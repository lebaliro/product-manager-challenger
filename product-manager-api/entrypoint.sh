#!/bin/sh -e

npx prisma migrate deploy

npm run start:prod