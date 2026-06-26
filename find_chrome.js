const fs = require('fs');
const path = require('path');

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
console.log('Found:', findChromePath());
