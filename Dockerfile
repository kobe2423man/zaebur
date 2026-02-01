FROM ghcr.io/puppeteer/puppeteer:latest

USER root
WORKDIR /app

# 👇 核心修改在这里：添加这行环境变量
# 告诉 Puppeteer 不要下载 Chrome，直接用镜像里自带的
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "index.js"]
