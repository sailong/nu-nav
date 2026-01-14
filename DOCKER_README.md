# Nu-Nav (牛导) - 极简极速导航系统

**Docker Image:** `sailong/nu-nav`

---

## 📚 镜像简介 (Description)

Nu-Nav 是一个基于 **React 19** 和 **Node.js** 构建的轻量级、响应式导航标签管理系统。此镜像为**全合一 (All-in-One)** 版本，内置了 Nginx（前端托管与反向代理）和 Node.js（后端 API），开箱即用。

**核心亮点：**
- 🚀 **极速体验**：前端基于 Vite + Tailwind CSS v4，加载毫秒级响应。
- 🎨 **精美 UI**：全站磨砂玻璃风格 (Glassmorphism)，支持自定义背景图。
- 📱 **多端适配**：完美兼容 PC 与 移动端。
- 🔧 **功能丰富**：支持多引擎搜索、标签分类管理、后台权限控制、图标动态配置。
- 🔒 **安全**：JWT 认证，自动生成安全密钥，支持密码修改。
- 🐳 **多架构支持**：原生支持 `linux/amd64` (x86) 和 `linux/arm64` (Apple Silicon/Raspberry Pi)。

---

## 🏷️ 分类 (Categories)

建议在 Docker Hub 或镜像库中添加以下分类标签：

- **Web Servers** (Web 服务器)
- **Productivity** (生产力工具)
- **Application Frameworks** (应用框架)
- **Web Development** (Web 开发)

**Tags:** `react`, `nodejs`, `navigation`, `dashboard`, `bookmark-manager`, `sqlite`, `nginx`

---

## 🚀 快速启动 (Quick Start)

### 1. 基础运行 (不持久化)
适合快速预览：
```bash
docker run -d -p 80:80 sailong/nu-nav:latest
```

### 2. 生产部署 (数据持久化)
推荐方式，确保数据不会丢失：
```bash
# 1. 创建数据目录
mkdir -p nu-nav-data

# 2. 启动容器
docker run -d \
  --name nu-nav \
  --restart always \
  -p 80:80 \
  -v $(pwd)/nu-nav-data:/app/backend/prisma \
  -e DATABASE_URL=file:/app/backend/prisma/dev.db \
  sailong/nu-nav:latest
```

### 3. 环境变量 (Environment Variables)

| 变量名 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `DATABASE_URL` | `file:/app/backend/prisma/dev.db` | SQLite 数据库路径 (建议保持默认并配合 Volume 使用) |
| `JWT_SECRET` | *自动生成* | JWT 签名密钥。若不指定，系统会自动生成并保存到数据目录。 |

---

## 🔗 相关链接
- **GitHub 仓库**: [https://github.com/sailong/nu-nav](https://github.com/sailong/nu-nav)
- **问题反馈**: [https://github.com/sailong/nu-nav/issues](https://github.com/sailong/nu-nav/issues)
