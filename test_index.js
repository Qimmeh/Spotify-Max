const puppeteer = require("puppeteer-core");
const path = require("path");

(async () => {
    const browser = await puppeteer.launch({
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        headless: true
    });
    const page = await browser.newPage();
    page.on("console", msg => console.log("PAGE LOG:", msg.text()));
    page.on("pageerror", err => console.log("PAGE ERROR:", err.message));
    
    await page.goto("file:///" + path.resolve("public/index.html").replace(/\\/g, "/"));
    
    await new Promise(r => setTimeout(r, 3000));
    await browser.close();
})();
