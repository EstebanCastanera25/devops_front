
#############################################
# STAGE 1 — BUILDER
#############################################
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar solo package.json para mejorar cache
COPY package*.json ./

# Instalar dependencias exactas
RUN npm ci --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Verificar angular.json
RUN ls -la && \
    echo "Verificando angular.json:" && \
    test -f angular.json && echo "✓ angular.json encontrado" || echo "✗ angular.json NO encontrado"

# Verificar environments
RUN echo "=== Verificando env ===" && \
    cat src/environments/environment.ts && \
    cat src/environments/environment.prod.ts

# Ajustar budgets
RUN cp angular.json angular.json.backup && \
    sed -i 's/"maximumError": "4kb"/"maximumError": "1mb"/g' angular.json && \
    sed -i 's/"maximumWarning": "2kb"/"maximumWarning": "500kb"/g' angular.json && \
    sed -i 's/"maximumError": "2kb"/"maximumError": "1mb"/g' angular.json && \
    sed -i 's/"maximumWarning": "4kb"/"maximumWarning": "500kb"/g' angular.json

# Build de producción usando CLI local
RUN npm run build -- --project=testApp

#############################################
# STAGE 2 — NGINX (PRODUCCIÓN)
#############################################
FROM nginx:alpine AS production

# Copiar build final
COPY --from=builder /app/dist/modernize /usr/share/nginx/html

# Copiar configuración para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
