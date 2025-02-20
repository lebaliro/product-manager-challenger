#!/bin/sh -e

npx prisma migrate deploy

npm node dist/main.js