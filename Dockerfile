# Stage 1: Build the Vite React app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Dynamically replace __PORT__ and __TARGET_URL__ with environment variables at startup
CMD ["sh", "-c", "sed -i \"s|__PORT__|${PORT}|g\" /etc/nginx/conf.d/default.conf && sed -i \"s|__TARGET_URL__|${VITE_API_TARGET_URL}|g\" /etc/nginx/conf.d/default.conf && nginx -g \"daemon off;\""]
