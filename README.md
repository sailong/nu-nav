# Nu-Nav (牛导) - 极简极速导航系统

Nu-Nav 是一款基于 **React 19** 和 **Node.js** 开发的现代化、响应式导航标签管理系统。它拥有极致的视觉设计和流畅的交互体验，支持自定义分类、标签管理、背景图设置以及多引擎站内外搜索。

## ✨ 核心特性

- **🚀 极致性能**：基于 Vite + React 19 构建，毫秒级响应速度。
- **🎨 现代设计**：采用 Tailwind CSS v4，全站支持 Glassmorphism（磨砂玻璃）设计风格。
- **🔍 智能搜索**：
  - **站内搜索**：实时过滤本地书签。
  - **多引擎切换**：一键切换 Google、Bing、百度等主流搜索引擎。
- **🛠️ 强大后台**：
  - **分类管理**：支持自定义分类名称与排序。
  - **标签管理**：轻松管理 Logo、链接、描述，支持 Logo 实时预览。
  - **外观设置**：一键更换前端背景图。
- **🔒 安全可靠**：后端采用 JWT 认证，支持管理员密码修改。
- **📱 响应式适配**：完美适配桌面端与移动端浏览器。

## 🛠️ 技术栈

### 前端
- **框架**: React 19
- **构建工具**: Vite
- **样式**: Tailwind CSS v4 (含 @tailwindcss/vite)
- **图标**: Lucide React
- **路由**: React Router v7
- **请求**: Axios

### 后端
- **运行环境**: Node.js
- **框架**: Express
- **数据库**: SQLite
- **ORM**: Prisma
- **认证**: JSON Web Token (JWT) & bcryptjs

## 📦 快速开始

### 1. 克隆并安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 2. 初始化数据库

```bash
cd backend
# 生成 Prisma 客户端
npx prisma generate
# 执行迁移（创建数据库文件）
npx prisma migrate dev --name init
# 初始化管理员账号 (admin / admin123)
node seed.js
```

### 3. 启动项目

建议开启两个终端分别运行：

```bash
# 启动后端 (默认端口: 3000)
cd backend
npm run dev

# 启动前端 (默认端口: 5173)
cd frontend
npm run dev
```

## 🖥️ 预览

- **首页**: `http://localhost:5173`
- **后台登录**: `http://localhost:5173/login`
- **默认账号**: `admin`
- **默认密码**: `admin123`

## 📄 开源协议
ISC License
