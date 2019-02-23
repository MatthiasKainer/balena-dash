const https = require('https');
const fs = require('fs');

function asImg(response) {
    return new Promise((resolve, reject) => {
        try {
            var file = fs.createWriteStream('random.jpg');
            response.pipe(file);
            file.on('finish', function () {
                file.close(() => resolve());
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

function asJson(response) {
    return new Promise((resolve, reject) => {
        let body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            return resolve(JSON.parse(body));
        });
    });
}

function get(path, onComplete) {
    const { NEXTCLOUD_USER, NEXTCLOUD_KEY, NEXTCLOUD_HOST } = process.env;
    const Authorization = 'Basic ' + Buffer.from(`${NEXTCLOUD_USER}:${NEXTCLOUD_KEY}`).toString('base64');

    const options = {
        hostname: NEXTCLOUD_HOST,
        port: 443,
        path,
        method: 'GET',
        headers: {
            Authorization
        }
      };
      
    return new Promise((resolve, reject) => {
        try {
            https.get(options, (response) => {
                if (response.statusCode !== 200) {
                    console.log(`Request to ${url} failed with status ${response.statusCode}!`);
                    return reject(response);
                }
                onComplete(response)
                    .then(resolve)
                    .catch(reject);
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

function download(image) {
    const url_files = `/index.php/apps/gallery/api/files/download/${image}`;
    return get(url_files, asImg);
}

function listFiles(location) {
    const url_files = `/index.php/apps/gallery/api/files/list?location=${encodeURI(location)}&mediatypes=image%2Fpng%3Bimage%2Fjpeg%3Bimage%2Fgif%3Bimage%2Fx-xbitmap%3Bimage%2Fbmp`;
    return get(url_files, asJson);
}

module.exports = {listFiles, download};