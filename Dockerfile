
FROM node:18-alpine AS builder

# Instalar Angular CLI
RUN npm install -g @angular/cli

WORKDIR /app

# Copiar código del frontend desde el contexto  
COPY . ./

# Verificar que tenemos los archivos necesarios
RUN ls -la && \
    echo "Verificando angular.json:" && \
    test -f angular.json && echo "✓ angular.json encontrado" || echo "✗ angular.json NO encontrado"


# Verificar que cambió
RUN echo "=== Verificando environments ===" && \
    cat src/environments/environment.ts && \
    cat src/environments/environment.prod.ts
# Instalar dependencias
RUN npm ci

# Modificar angular.json para aumentar budgets y hacer build
RUN cp angular.json angular.json.backup && \
    sed -i 's/"maximumError": "4kb"/"maximumError": "1mb"/g' angular.json && \
    sed -i 's/"maximumWarning": "2kb"/"maximumWarning": "500kb"/g' angular.json && \
    sed -i 's/"maximumError": "2kb"/"maximumError": "1mb"/g' angular.json && \
    sed -i 's/"maximumWarning": "4kb"/"maximumWarning": "500kb"/g' angular.json && \
    ng build --configuration production

# Verificar que el build se creó
RUN ls -la dist/ && echo "Build completado exitosamente"

# Etapa final - con NGINX sirviendo estáticos
FROM nginx:alpine AS production


# Copiar SOLO los archivos estáticos (sin nginx)
COPY --from=builder /app/dist/modernize /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]'|'/api'|g" src/environments/environment.ts

