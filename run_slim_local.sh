#!/bin/bash

GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}=== 正在构建前端 (Frontend Build)... ===${NC}"
cd frontend
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "前端构建失败"
    exit 1
fi
cd ..

echo -e "\n${GREEN}=== 正在准备后端 (Backend Setup)... ===${NC}"
cd backend
npm install
npx prisma generate --schema ./prisma/schema.prisma
# 确保数据库是最新的
npx prisma migrate deploy --schema ./prisma/schema.prisma
# 尝试播种数据 (如果已存在会跳过)
node seed.js

echo -e "\n${GREEN}=== 启动极简版服务 (Slim Mode) ===${NC}"
echo "请访问: http://localhost:3000"
echo "按 Ctrl+C 停止"

# 设置生产环境变量，确保 express.static 生效
export NODE_ENV=production
node index.js
