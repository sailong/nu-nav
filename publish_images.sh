#!/bin/bash

# ================= 配置区域 =================
REGISTRY=""
NAMESPACE="simonchang" # 您的 Docker Hub 用户名
PROJECT_NAME="nu-nav"
PLATFORMS="linux/amd64,linux/arm64"
# ===========================================

GREE N='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}=== 开始构建并推送 Docker 镜像 ===${NC}"

# --- 0. 选择构建版本 ---
echo -e "\n请选择要构建的版本："
echo "1) 标准版 (Standard)"
echo "   - 包含 Nginx (前端代理) + Node.js (后端)"
echo "   - 配置文件: Dockerfile"
echo "   - 默认标签: latest"
echo "2) 精简版 (Slim)"
echo "   - 仅 Node.js (后端托管静态资源)"
echo "   - 配置文件: Dockerfile.slim"
echo "   - 默认标签: slim"
echo "   - 体积极小 (推荐)"

read -p "请输入选项 (1 或 2): " VERSION_CHOICE

if [ "$VERSION_CHOICE" == "2" ]; then
    DOCKERFILE="Dockerfile.slim"
    DEFAULT_TAG="slim"
    echo -e ">> 已选择: ${GREEN}精简版 (Slim)${NC}"
else
    DOCKERFILE="Dockerfile"
    DEFAULT_TAG="latest"
    echo -e ">> 已选择: ${GREEN}标准版 (Standard)${NC}"
fi

# 允许用户自定义标签
read -p "请输入镜像标签 (直接回车使用 '${DEFAULT_TAG}'): " CUSTOM_TAG
TAG=${CUSTOM_TAG:-$DEFAULT_TAG}

echo -e ">> 最终配置: 文件=${DOCKERFILE}, 标签=${TAG}"

# --- 1. 检查 Buildx ---
if ! docker buildx version > /dev/null 2>&1; then
    echo "Error: Docker Buildx 未安装。"
    exit 1
fi

BUILDER_NAME="nu-nav-builder"
if ! docker buildx inspect $BUILDER_NAME > /dev/null 2>&1; then
    docker buildx create --name $BUILDER_NAME --use
else
    docker buildx use $BUILDER_NAME
fi

# --- 2. 登录检查 ---
echo -e "\n${GREEN}>> 检查 Docker 登录状态...${NC}"
echo "预期上传至: ${NAMESPACE}"
read -p "是否使用当前 Docker 登录凭证？(y/n) " LOGIN_CONFIRM
if [[ "$LOGIN_CONFIRM" != "y" && "$LOGIN_CONFIRM" != "Y" ]]; then
    echo "执行重新登录..."
    docker logout $REGISTRY
    docker login $REGISTRY
else
    echo "保持当前登录状态..."
fi

# --- 3. 构建并推送 ---
IMAGE_NAME="${NAMESPACE}/${PROJECT_NAME}:${TAG}"
if [ -n "$REGISTRY" ]; then
    IMAGE_NAME="${REGISTRY}/${NAMESPACE}/${PROJECT_NAME}:${TAG}"
fi

echo -e "\n${GREEN}>> 开始构建: ${IMAGE_NAME}${NC}"
echo ">> 使用配置文件: ${DOCKERFILE}"

docker buildx build \
  --platform $PLATFORMS \
  -t "$IMAGE_NAME" \
  -f $DOCKERFILE \
  . \
  --push

if [ $? -ne 0 ]; then
    echo -e "\n${GREEN}❌ 构建失败！${NC}"
    exit 1
fi

echo -e "\n${GREEN}=== 🎉 镜像构建并推送成功！ ===${NC}"
echo "镜像地址: $IMAGE_NAME"
echo "架构支持: $PLATFORMS"
echo -e "\n您可以运行以下命令启动服务:"
echo "docker run -d -p 80:80 -v $(pwd)/nu-nav-data:/app/backend/prisma -e DATABASE_URL=file:/app/backend/prisma/dev.db $IMAGE_NAME"