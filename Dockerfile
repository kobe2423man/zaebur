FROM ghcr.io/puppeteer/puppeteer:latest

# 1. 【核心修正】切换到 root 用户，拥有最高权限
USER root

WORKDIR /app

# 2. 【强制】指定缓存目录到当前文件夹，不再依赖用户目录
ENV PUPPETEER_CACHE_DIR=/app/.cache
# 3. 允许下载
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

COPY package*.json ./

# 4. 安装依赖 (使用淘宝镜像源)
RUN npm config set registry https://registry.npmmirror.com
RUN npm install

# 5. 【双重保险】手动触发一次浏览器下载，确保它躺在 /app/.cache 里
RUN npx puppeteer browsers install chrome

COPY . .

# 6. 启动
CMD ["node", "index.js"]
