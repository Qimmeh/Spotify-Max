const { app, BrowserWindow } = require('electron');
app.whenReady().then(async () => {
    let win = new BrowserWindow({ show: false });
    win.loadURL('https://shaka-player-demo.appspot.com/demo/');
    win.webContents.on('console-message', (e, level, msg) => {
        console.log('PAGE CONSOLE:', msg);
    });
    setTimeout(() => app.quit(), 5000);
});
