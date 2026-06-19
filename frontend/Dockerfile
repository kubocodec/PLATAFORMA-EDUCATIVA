# ---- Etapa de build (Angular 17) ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Build de producción → genera dist/frontend/browser (application builder de Angular 17)
RUN npm run build

# ---- Etapa de runtime (Nginx) ----
FROM nginx:alpine
# Reemplaza la config por defecto por la nuestra (SPA + proxy /api)
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/app.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O - http://localhost:80/ >/dev/null 2>&1 || exit 1
