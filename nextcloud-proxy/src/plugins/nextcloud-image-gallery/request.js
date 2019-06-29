const https = require('https');
const fs = require('fs');

function asDataItem(response, meta) {
    return new Promise((resolve, reject) => {
        try {
            response.setEncoding('base64');
            let body = "data:" + response.headers["content-type"] + ";base64,";
            response.on('data', (data) => { body += data});
            response.on('end', () => {
                fs.writeFile(`${__dirname}/__data/next.json`, JSON.stringify({ 
                    result: body, 
                    meta
                }), { encoding: "UTF-8"}, (err) => {
                    console.log("Stored data file", `${__dirname}/__data/next.json`)
                    return err ? reject(err) : resolve();
                })
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
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
                    console.log(`Request to ${options.path} failed with status ${response.statusCode}!`);
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

function download(image, mtime) {
    const url_files = `/index.php/apps/gallery/api/preview/${image}/600/600`;
    return get(url_files, (response) => asDataItem(response, { time : mtime * 1000 }));
}

function listFiles(location) {
    const url_files = `/index.php/apps/gallery/api/files/list?location=${encodeURI(location)}&mediatypes=image%2Fpng%3Bimage%2Fjpeg%3Bimage%2Fgif%3Bimage%2Fx-xbitmap%3Bimage%2Fbmp`;
    return get(url_files, asJson);
}

module.exports = {listFiles, download};