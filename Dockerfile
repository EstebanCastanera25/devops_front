FROM node:18 AS builder

WORKDIR /app

ENV NODE_OPTIONS=--max-old-space-size=4096

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build -- --configuration production

FROM nginx:alpine

COPY --from=builder /app/dist/modernize/browser /usr/share/nginx/html

RUN echo 'server {listen 80;root /usr/share/nginx/html;index index.html;location / {try_files $uri $uri/ /index.html;}}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
