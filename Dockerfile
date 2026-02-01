FROM ghcr.io/puppeteer/puppeteer:latest

USER root
WORKDIR /app

# 复制文件
COPY package*.json ./
RUN npm install

COPY . .

# 启动
CMD ["node", "index.js"]
