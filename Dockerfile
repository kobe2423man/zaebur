FROM ghcr.io/puppeteer/puppeteer:latest

# 1. 关键设置：告诉 Puppeteer 不要自己下载 Chrome，也不要乱找路径
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /home/pptruser

# 2. 复制配置并安装依赖 (使用淘宝源加速，解决卡顿)
COPY --chown=pptruser:pptruser package*.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm install

# 3. 复制脚本代码
COPY --chown=pptruser:pptruser . .

# 4. 启动
CMD ["node", "index.js"]
