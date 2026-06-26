const { song_url_v1 } = require('NeteaseCloudMusicApi');
async function test() {
    try {
        const res = await song_url_v1({ id: 1519343, level: 'standard' });
        console.log(res.body.data[0]);
    } catch(e) { console.error(e); }
}
test();
