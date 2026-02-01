const puppeteer = require('puppeteer');

const TARGET_URL = process.env.IDX_URL; 

if (!TARGET_URL) {
    console.error("错误：请在 Zeabur 环境变量中设置 IDX_URL");
    process.exit(1);
}

async function ping() {
    console.log(`[${new Date().toLocaleString()}] 开始访问: ${TARGET_URL}`);
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });

    try {
        const page = await browser.newPage();
        // 屏蔽资源省流量
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log(`✅ 访问成功`);
        await new Promise(r => setTimeout(r, 10000)); // 停留10秒

    } catch (error) {
        console.error(`❌ 访问出错: ${error.message}`);
    } finally {
        await browser.close();
    }
}

// 启动立即执行一次
ping();
// 每 15 分钟执行一次
setInterval(ping, 15 * 60 * 1000);
