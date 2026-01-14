# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Final Image
FROM node:20-alpine

# 安装 Nginx 和 Supervisord
RUN apk add --no-cache nginx supervisor

WORKDIR /app

# --- Backend Setup ---
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production
COPY backend/ .
# Generate Prisma Client
RUN npx prisma generate

# --- Frontend Setup ---
# 从第一阶段复制构建好的静态文件到 Nginx 目录
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# --- Configuration ---
# 复制 Nginx 配置 (我们需要创建一个新的 nginx.conf 适配单容器)
COPY nginx-combined.conf /etc/nginx/http.d/default.conf
# 确保 Nginx 运行目录存在
RUN mkdir -p /run/nginx

# 复制 Supervisord 配置
COPY supervisord.conf /etc/supervisord.conf

# 暴露端口 (Nginx 监听 80)
EXPOSE 80

# 启动 Supervisord (它会负责启动 Nginx 和 Node)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
