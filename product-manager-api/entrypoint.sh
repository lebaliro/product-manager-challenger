#!/bin/sh
# Executa as migrações do Prisma
npx prisma migrate deploy

# Inicia a aplicação
exec npm run start:prod