FROM ghcr.io/puppeteer/puppeteer:latest

# 👇👇👇 核心修改在这里 👇👇👇
# 必须显式设置为 false，否则 npm install 会跳过浏览器下载
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

WORKDIR /home/pptruser

COPY --chown=pptruser:pptruser package*.json ./

# 配置镜像源加速，并运行安装
# ⚠️ 注意：这次构建时间会变长（约 2-3 分钟），因为要下载 150MB 的 Chrome
RUN npm config set registry https://registry.npmmirror.com
RUN npm install

COPY --chown=pptruser:pptruser . .

CMD ["node", "index.js"]
