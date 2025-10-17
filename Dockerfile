FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps --force

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist/modernize/browser /usr/share/nginx/html

RUN echo 'server {listen 80;root /usr/share/nginx/html;index index.html;location / {try_files $uri $uri/ /index.html;}}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
