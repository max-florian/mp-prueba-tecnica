# Construcción (Build)
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Genera la carpeta /dist
RUN npm run build

# Exponer la api
FROM nginx:alpine

# Se copia el build de React a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuracion
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]