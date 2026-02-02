FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /home/pptruser

# 1. 复制配置
COPY --chown=pptruser:pptruser package*.json ./

# 2. 安装依赖 (保留淘宝镜像源加速 npm，但允许下载 Chrome)
RUN npm config set registry https://registry.npmmirror.com
RUN npm install

# 3. 复制剩余文件
COPY --chown=pptruser:pptruser . .

# 4. 启动
CMD ["node", "index.js"]
