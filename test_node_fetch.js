const fs = require('fs');
async function test() {
    const tokenFile = fs.readFileSync('.spotify-token', 'utf8');
    const token = JSON.parse(tokenFile).access_token;
    const res = await fetch('https://api.spotify.com/v1/search?q=baby&type=track&limit=18', {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body:', text);
}
test();
