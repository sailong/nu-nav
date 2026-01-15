#!/bin/bash

# ================= 配置区域 =================
REGISTRY=""
NAMESPACE="simonchang" # 修改为自己的命名空间
PROJECT_NAME="nu-nav"
TAG="latest"
PLATFORMS="linux/amd64,linux/arm64"
# ===========================================

GREE N='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}=== 开始构建并推送合并版(All-in-One)镜像 ===${NC}"

# 1. 检查 Buildx
if ! docker buildx version > /dev/null 2>&1; then
    echo "Error: Docker Buildx 未安装。"
    exit 1
fi

BUILDER_NAME="nu-nav-builder"
# Check if builder exists
if ! docker buildx inspect $BUILDER_NAME > /dev/null 2>&1; then
    echo "创建新的 buildx builder: $BUILDER_NAME"
    docker buildx create --name $BUILDER_NAME --use
else
    echo "使用已存在的 buildx builder: $BUILDER_NAME"
    docker buildx use $BUILDER_NAME
fi

# 2. 登录检查
echo -e "\n${GREEN}>> 检查 Docker 登录状态...${NC}"

# 尝试获取当前登录的用户名 (这取决于 config.json 的格式，这里用简单的 grep 检查，或者直接询问)
# 由于 docker info 并不总是直接显示用户名，我们采用交互式确认
echo "请确认您当前是否已登录 Docker Hub (或目标仓库)？"
echo "预期的上传命名空间为: ${NAMESPACE}"

read -p "是否继续使用当前登录凭证？(y/n) " LOGIN_CONFIRM
if [ "$LOGIN_CONFIRM" != "y" ] && [ "$LOGIN_CONFIRM" != "Y" ]; then
    echo "正在执行登出并重新登录..."
    docker logout $REGISTRY
    docker login $REGISTRY
else
    echo "尝试使用当前凭证..."
    # 简单的验证：尝试拉取一个私有镜像或者 just proceed. 
    # 如果没登录，后面的 push 会失败，但这通常是可以接受的。
    # 或者我们可以尝试运行一次 docker login 它是幂等的，如果已登录会直接通过
    # 但用户要求“手动确定”，所以如果选 y，我们就不执行 login 了，除非 push 失败。
fi

# 3. 构建合并镜像
IMAGE_NAME="${NAMESPACE}/${PROJECT_NAME}:${TAG}"
if [ -n "$REGISTRY" ]; then
    IMAGE_NAME="${REGISTRY}/${NAMESPACE}/${PROJECT_NAME}:${TAG}"
fi

echo -e "\n${GREEN}>> 构建并推送: ${IMAGE_NAME}${NC}"
# 注意：上下文设为当前目录 (.)，因为 Dockerfile 需要同时访问 frontend 和 backend 目录
docker buildx build \
  --platform $PLATFORMS \
  -t "$IMAGE_NAME" \
  -f Dockerfile \
  . \
  --push

if [ $? -ne 0 ]; then
    echo "构建失败！"
    exit 1
fi

echo -e "\n${GREEN}=== 🎉 镜像构建成功！ ===${NC}"
echo "镜像地址: $IMAGE_NAME"
echo -e "\n您可以运行以下命令启动服务:"
echo "docker run -d -p 80:80 -v \
$(pwd)/data:/app/data -e DATABASE_URL=file:/app/data/dev.db $IMAGE_NAME"
