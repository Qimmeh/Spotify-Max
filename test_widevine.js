const { app, components, BrowserWindow } = require('electron');
app.whenReady().then(async () => {
    try {
        if (components) {
            console.log('Fetching Widevine component...');
            await components.whenReady();
            console.log('Widevine component ready:', components.status());
        }
        let win = new BrowserWindow({ show: false, webPreferences: { plugins: true } });
        win.loadURL('https://bitmovin.com/demos/drm');
        win.webContents.on('console-message', (e, level, msg) => {
            console.log('PAGE CONSOLE:', msg);
        });
        setTimeout(() => app.quit(), 5000);
    } catch(e) { console.error('Error:', e); app.quit(); }
});
