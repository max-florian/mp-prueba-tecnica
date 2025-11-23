FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias primero
COPY package*.json ./

RUN npm install

# Se copia el resto del código
COPY . .

EXPOSE 9000

CMD ["npm", "start"]