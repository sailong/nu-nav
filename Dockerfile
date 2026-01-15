# Stage 1: Build Frontend
FROM public.ecr.aws/docker/library/node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Final Image
FROM public.ecr.aws/docker/library/node:20-alpine

# 安装 Nginx 和 Supervisord
RUN apk add --no-cache nginx supervisor openssl

WORKDIR /app

# --- Backend Setup ---
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production
COPY backend/ .
# Generate Prisma Client
RUN npx prisma generate

# --- Frontend Setup ---
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# --- Configuration ---
COPY nginx-combined.conf /etc/nginx/http.d/default.conf
RUN mkdir -p /run/nginx
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]