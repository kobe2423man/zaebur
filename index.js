const puppeteer = require('puppeteer');

const TARGET_URL = process.env.IDX_URL;

// 检查环境变量
if (!TARGET_URL) {
    console.error("❌ 严重错误：请在 Zeabur 环境变量中设置 IDX_URL");
    process.exit(1);
}

async function ping() {
    console.log(`[${new Date().toLocaleString()}] 🚀 开始执行保活任务...`);
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            // 👇👇👇 核心修复：强制使用系统自带的 Chrome 👇👇👇
            executablePath: '/usr/bin/google-chrome-stable',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // 解决 Docker 内存不足崩溃
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        
        // 开启省流模式：拦截图片、字体、样式表
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const resourceType = req.resourceType();
            if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                req.abort();
            } else {
                req.continue();
            }
        });

        console.log(`正在访问目标: ${TARGET_URL}`);
        // 设置 60秒超时，等待页面加载完成
        await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log(`✅ 访问成功！页面已激活`);
        
        // 保持 30 秒活跃状态
        await new Promise(r => setTimeout(r, 30000));

    } catch (error) {
        console.error(`❌ 任务出错: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
        console.log(`本轮任务结束，等待下一次循环...`);
    }
}

// 1. 启动时立即执行一次
ping();

// 2. 之后每 15 分钟执行一次
setInterval(ping, 15 * 60 * 1000);
