FROM ghcr.io/puppeteer/puppeteer:latest
USER root
WORKDIR /app
COPY . .
RUN npm install
# 赋予执行权限
RUN chmod +x index.js
CMD ["node", "index.js"]
