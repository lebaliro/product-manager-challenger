#!/bin/sh -e

npx prisma migrate deploy

npm npm run start:prod