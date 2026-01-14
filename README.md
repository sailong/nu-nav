# Nu-Nav (牛导) - 极简极速导航系统

Nu-Nav 是一款基于 **React 19** 和 **Node.js** 开发的现代化、响应式导航标签管理系统。它拥有极致的视觉设计和流畅的交互体验，支持自定义分类、标签管理、背景图设置以及多引擎站内外搜索。

## ✨ 核心特性

- **🚀 极致性能**：基于 Vite + React 19 构建，毫秒级响应速度。
- **🎨 现代设计**：采用 Tailwind CSS v4，全站支持 Glassmorphism（磨砂玻璃）设计风格。
- **🔍 智能搜索**：
  - **站内搜索**：动态管理，实时过滤本地书签。
  - **多引擎切换**：一键切换 Google、Bing、百度等主流搜索引擎，支持后台自定义。
- **🛠️ 强大后台**：
  - **分类管理**：支持自定义分类名称与排序。
  - **标签管理**：轻松管理 Logo、链接、描述，支持 Logo 实时预览。
  - **外观设置**：一键更换系统标题、浏览器图标及前端背景图。
- **🔒 安全可靠**：后端采用 JWT 认证，自动生成并持久化安全密钥。
- **📱 响应式适配**：完美适配桌面端与移动端浏览器。

## 🛠️ 技术栈

### 前端
- **框架**: React 19
- **构建工具**: Vite
- **样式**: Tailwind CSS v4
- **图标**: Lucide React
- **路由**: React Router v7

### 后端
- **运行环境**: Node.js (Express 5)
- **数据库**: SQLite
- **ORM**: Prisma
- **认证**: JWT & bcryptjs

## 📦 快速开始 (本地开发)

### 1. 安装依赖

```bash
# 后端
cd backend && npm install
# 前端
cd ../frontend && npm install
```

### 2. 初始化数据库

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
node seed.js
```

### 3. 启动开发环境

```bash
# 终端 1: 后端
cd backend && npm run dev
# 终端 2: 前端
cd frontend && npm run dev
```

---

## ⚡ 极简版启动 (Slim Mode)

如果您想在本地直接以生产模式运行（后端托管前端，无需 Nginx），可以直接运行：

```bash
./run_slim_local.sh
```
访问地址: `http://localhost:3000`

---

## 🐳 Docker 部署 (推荐)

本项目支持 Docker 一键部署，镜像完美兼容 x86 (AMD64) 和 ARM64 架构。

### 1. 选择版本

- **标准版 (`latest`)**: 内置 Nginx + Node.js，性能最优。
- **精简版 (`slim`)**: 纯 Node.js 环境，体积极小 (~80MB)。

### 2. 使用 Docker Run 启动 (以精简版为例)

```bash
mkdir -p data

docker run -d \
  --name nu-nav \
  --restart always \
  -p 3000:80 \
  -v $(pwd)/data:/app/data \
  -e DATABASE_URL=file:/app/data/dev.db \
  simonchang/nu-nav:slim
```

### 3. 使用 Docker Compose 启动

```bash
# 启动精简版
docker-compose -f docker-compose.slim.yml up -d
```

### 4. 访问

直接访问：`http://localhost:3000`

### 📋 说明

- **默认账号**: `admin` / `admin123`
- **数据持久化**: 所有数据保存在 `./data` 目录中，请务必妥善保管。
- **自动密钥**: 系统首次启动会生成 `jwt.secret` 文件存放在数据目录，确保重启后登录状态不丢失。

## 📄 开源协议
ISC License