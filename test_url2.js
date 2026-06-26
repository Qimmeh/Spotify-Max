const { cloudsearch, song_url_v1 } = require('NeteaseCloudMusicApi');
async function test() {
    try {
        const searchRes = await cloudsearch({ keywords: 'Alan Walker Faded', type: 1, limit: 1 });
        const id = searchRes.body.result.songs[0].id;
        console.log('ID:', id);
        const res = await song_url_v1({ id: id, level: 'standard' });
        console.log(res.body.data[0]);
    } catch(e) { console.error(e); }
}
test();
