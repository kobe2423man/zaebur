const puppeteer = require('puppeteer');

const TARGET_URL = process.env.IDX_URL;

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
            // 👇 注意：这里删除了 executablePath 行，完全让它自动处理 👇
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        
        // 省流模式
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        console.log(`正在访问目标: ${TARGET_URL}`);
        await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log(`✅ 访问成功！页面已激活`);
        
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

ping();
setInterval(ping, 15 * 60 * 1000);
