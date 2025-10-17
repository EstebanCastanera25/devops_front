# Dockerfile para Frontend Angular (sin nginx.conf externo)

# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Etapa 2: Producción con Nginx
FROM nginx:alpine

# Copiar los archivos build de Angular a nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear configuración nginx inline
RUN echo 'server { \n\
    listen 80; \n\
    server_name localhost; \n\
    root /usr/share/nginx/html; \n\
    index index.html; \n\
    location / { \n\
        try_files $uri $uri/ /index.html; \n\
    } \n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
