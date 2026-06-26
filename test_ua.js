const { app, BrowserWindow } = require('electron');
app.whenReady().then(() => {
    let win = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true } });
    win.webContents.executeJavaScript('console.log(navigator.userAgent)').then(ua => {
        console.log('USER_AGENT:', ua);
        app.quit();
    });
});
