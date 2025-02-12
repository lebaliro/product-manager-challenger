FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install 

RUN npm i -g @nestjs/cli

COPY . .

RUN npm run build

EXPOSE 3000