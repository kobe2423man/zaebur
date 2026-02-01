FROM jlesage/firefox:latest

# 设置环境变量，限制资源占用
ENV VNC_PASSWORD=YourSecurePassword  
ENV DISPLAY_WIDTH=1024
ENV DISPLAY_HEIGHT=768
ENV KEEP_APP_RUNNING=1

# 建议在浏览器内手动关闭不必要的服务
# 这里的 /config 目录后续需要在 Zeabur 中挂载 Volume
