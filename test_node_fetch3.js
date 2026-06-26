const fs = require('fs');
async function test() {
    const tokenFile = fs.readFileSync('.spotify-token', 'utf8');
    const token = JSON.parse(tokenFile).access_token;
    const res = await fetch('https://api.spotify.com/v1/search?q=baby&type=track', {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    console.log('Tracks count:', data.tracks ? data.tracks.items.length : 0);
}
test();
