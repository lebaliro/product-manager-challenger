#!/bin/bash

# Função para verificar se o banco de dados está pronto
wait_for_db() {
  echo "Aguardando o banco de dados ficar disponível..."
  until PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "$POSTGRES_USER" -c '\l' &> /dev/null; do
    echo "Banco de dados ainda não está pronto. Tentando novamente em 5 segundos..."
    sleep 5
  done
  echo "Banco de dados está pronto!"
}

# Aguarda o banco de dados ficar disponível
wait_for_db

# Aplica migrações para o ambiente de testes (.env.test)
echo "Aplicando migrações para o ambiente de testes..."
(
  export $(cat .env.test | xargs) # Carrega variáveis de .env.test
  echo "DATABASE_URL=$DATABASE_URL"
  npx prisma migrate dev
)

# Aplica migrações para o ambiente de desenvolvimento (.env)
echo "Aplicando migrações para o ambiente de desenvolvimento..."
(
  export $(cat .env | xargs) # Carrega variáveis de .env
  echo "DATABASE_URL=$DATABASE_URL"
  npx prisma migrate dev
)

# Inicia a aplicação
echo "Iniciando a aplicação..."
exec npm run start:dev