#!/bin/sh

npx prisma migrate deploy

npm node dist/main.js