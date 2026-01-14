# Docker Compose 使用指南

本项目提供了两种 Docker Compose 配置文件，分别对应**标准版**和**精简版**镜像。您可以根据服务器资源和需求选择适合的版本。

---

## 1. 版本对比

| 特性 | 标准版 (`docker-compose.yml`) | 精简版 (`docker-compose.slim.yml`) |
| :--- | :--- | :--- |
| **镜像标签** | `latest` | `slim` |
| **体积** | 较大 (~200MB) | **极小 (~80MB)** |
| **架构** | Nginx + Node.js (Supervisord 管理) | 纯 Node.js (单进程) |
| **适用场景** | 需要 Nginx 高级特性或高并发静态资源 | 资源受限环境、个人使用、追求极致轻量 |
| **性能** | 静态资源由 Nginx 处理，性能略优 | 静态资源由 Express 处理，足够应对常规使用 |

---

## 2. 使用标准版 (Standard)

标准版包含完整的 Nginx 反向代理，架构更接近传统生产环境。

**启动命令：**
```bash
docker-compose up -d
```

**停止命令：**
```bash
docker-compose down
```

---

## 3. 使用精简版 (Slim)

精简版去除了 Nginx 和进程管理工具，仅运行核心 Node.js 服务，大幅降低了内存占用和镜像体积。

**启动命令：**
```bash
# 使用 -f 指定配置文件
docker-compose -f docker-compose.slim.yml up -d
```

**停止命令：**
```bash
docker-compose -f docker-compose.slim.yml down
```

---

## 4. 常见问题

**Q: 两个版本的数据通吗？**
A: **是的，完全互通。** 
两个配置文件都默认将数据挂载到 `./nu-nav-data` 目录。您可以随时停止一个版本并启动另一个版本，您的分类、标签和设置都会保留。

**Q: 如何查看正在运行的是哪个版本？**
A: 使用 `docker ps` 查看 `IMAGE` 列：
- 显示 `simonchang/nu-nav:latest` 为标准版。
- 显示 `simonchang/nu-nav:slim` 为精简版。
