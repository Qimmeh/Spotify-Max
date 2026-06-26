const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

let browser = null;
let page = null;

function findChromePath() {
    const paths = [
        process.env.ProgramFiles + '\\Google\\Chrome\\Application\\chrome.exe',
        process.env['ProgramFiles(x86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
        process.env.LocalAppData + '\\Google\\Chrome\\Application\\chrome.exe',
        process.env.ProgramFiles + '\\Microsoft\\Edge\\Application\\msedge.exe',
        process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe'
    ];
    for (const p of paths) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

async function initPhantomEngine() {
    if (browser) return;
    
    const chromePath = findChromePath();
    if (!chromePath) {
        console.error('[PhantomEngine] Chrome or Edge not found.');
        return;
    }

    const userDataDir = path.join(app.getPath('userData'), 'phantom-profile');

    console.log('[PhantomEngine] Launching browser visibly...');
    browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: false,
        defaultViewport: null,
        userDataDir: userDataDir,
        ignoreDefaultArgs: ['--enable-automation'],
        args: [
            '--window-size=1000,800',
            '--disable-gpu',
            '--disable-notifications'
        ]
    });

    page = await browser.newPage();
    try {
      await page.goto('https://open.spotify.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
    } catch (e) {
      console.warn('[PhantomEngine] Initial page goto timeout/error:', e.message);
    }

    // Try to bring the page to front explicitly
    await page.bringToFront();

    const isLoggedIn = await page.evaluate(() => {
        return !!document.querySelector('[data-testid="user-widget-link"]');
    });

    if (isLoggedIn) {
        console.log('[PhantomEngine] Already logged in. Minimizing window.');
        const session = await page.target().createCDPSession();
        const { windowId } = await session.send('Browser.getWindowForTarget');
        await session.send('Browser.setWindowBounds', {
            windowId,
            bounds: { windowState: 'minimized' }
        });
    } else {
        console.log('[PhantomEngine] Not logged in. Waiting for user login...');
        while (true) {
            try {
                const loggedInNow = await page.evaluate(() => {
                    return !!document.querySelector('[data-testid="user-widget-link"]');
                });
                if (loggedInNow) break;
            } catch (e) {}
            await new Promise(r => setTimeout(r, 2000));
        }
        console.log('[PhantomEngine] Login successful. Minimizing window.');
        const session = await page.target().createCDPSession();
        const { windowId } = await session.send('Browser.getWindowForTarget');
        await session.send('Browser.setWindowBounds', {
            windowId,
            bounds: { windowState: 'minimized' }
        });
    }
}

async function playTrack(uri) {
    if (!page) await initPhantomEngine();
    console.log('[PhantomEngine] Playing URI:', uri);
    const trackId = uri.split(':').pop();
    try {
        await page.goto('https://open.spotify.com/track/' + trackId, { waitUntil: 'domcontentloaded', timeout: 60000 });
      } catch (e) {
        console.warn('[PhantomEngine] Track goto timeout/error:', e.message);
      }
    
    try {
        await page.waitForSelector('[data-testid="play-button"]', { timeout: 10000 });
        await page.click('[data-testid="play-button"]');
        console.log('[PhantomEngine] Clicked play on track.');
    } catch (e) {
        console.error('[PhantomEngine] Failed to click play:', e.message);
    }
}

async function pauseTrack() {
    if (!page) return;
    try {
        await page.evaluate(() => {
            const btn = document.querySelector('[data-testid="control-button-pause"]');
            if (btn) btn.click();
        });
    } catch (e) {
        console.error('[PhantomEngine] Failed to pause:', e.message);
    }
}

async function resumeTrack() {
    if (!page) return;
    try {
        await page.evaluate(() => {
            const btn = document.querySelector('[data-testid="control-button-play"]');
            if (btn) btn.click();
        });
    } catch (e) {
        console.error('[PhantomEngine] Failed to resume:', e.message);
    }
}

module.exports = {
    initPhantomEngine,
    playTrack,
    pauseTrack,
    resumeTrack
};
