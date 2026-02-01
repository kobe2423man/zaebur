FROM ghcr.io/puppeteer/puppeteer:latest

# 1. 告诉 Puppeteer 不要下载 Chrome (镜像里自带了)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 2. 设置工作目录 (默认是 /home/pptruser)
WORKDIR /home/pptruser

# 3. 关键：复制文件时把所有权给 pptruser，否则 npm install 会报错
COPY --chown=pptruser:pptruser package*.json ./
RUN npm install

COPY --chown=pptruser:pptruser . .

# 4. 启动脚本
CMD ["node", "index.js"]
