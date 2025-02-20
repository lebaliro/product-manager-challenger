FROM node:20-alpine

RUN apk update && apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN chmod +x /app/wait-for-db-and-migrate.sh

RUN npm run build

EXPOSE 3000