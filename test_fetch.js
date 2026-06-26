const { app, net } = require('electron');
app.whenReady().then(async () => {
    try {
        const tokenFile = require('fs').readFileSync('.spotify-token', 'utf8');
        const token = JSON.parse(tokenFile).access_token;
        console.log('Token:', token.substring(0, 10));
        
        const res = await net.fetch('https://api.spotify.com/v1/search?q=baby&type=track&limit=18', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text);
    } catch(e) { console.error('Error:', e); }
    app.quit();
});
