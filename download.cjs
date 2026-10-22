const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'upload.wikimedia.org',
  path: '/wikipedia/commons/thumb/a/a6/Seal_of_Tamil_Nadu.svg/512px-Seal_of_Tamil_Nadu.svg.png',
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/100.0.4896.127 Safari/537.36' }
};

https.get(options, (res) => {
  if (res.statusCode === 200) {
    res.pipe(fs.createWriteStream('public/tn-logo.png'));
  } else {
    console.error(`Status Code: ${res.statusCode}`);
  }
}).on('error', (e) => {
  console.error(e);
});
