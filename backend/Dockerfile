FROM node:20-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install --production

# 复制源码
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 暴露端口
EXPOSE 3000

# 启动命令：先执行数据库迁移，再启动服务
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
