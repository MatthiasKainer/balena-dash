const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
https.globalAgent.maxSockets = 1;
require('dotenv').config();
const cache = new Set();
const loadedAlbums = new Set();

const mimeType = {
    '.html': 'text/html',
    '.jpg': 'image/jpeg',
};

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

function get(url, onComplete) {
    const { NEXTCLOUD_USER, NEXTCLOUD_KEY, NEXTCLOUD_HOST } = process.env;
    const Authorization = 'Basic ' + Buffer.from(`${NEXTCLOUD_USER}:${NEXTCLOUD_KEY}`).toString('base64');
    return new Promise((resolve, reject) => {
        try {
            https.get(url, {
                headers: {
                    Authorization
                }
            }, (response) => {
                if (response.statusCode !== 200) {
                    console.log(`Request to ${url} failed with status ${response.statusCode}!`);
                    return reject(response);
                }
                onComplete(response)
                    .then(resolve)
                    .catch(reject);
            });
        } catch (err) { console.log(err); reject(err); }
    })
}


const fillCache = (location) => {
    if (location === undefined) return;
    const url_files = `https://${process.env.NEXTCLOUD_HOST}/index.php/apps/gallery/api/files/list?location=${location}&mediatypes=image%2Fpng%3Bimage%2Fjpeg%3Bimage%2Fgif%3Bimage%2Fx-xbitmap%3Bimage%2Fbmp`;
    get(url_files, asJson).then(response => {
        const oldSize = cache.size;
        response.files.forEach(file => cache.add(file.nodeid));
        Object.keys(response.albums).forEach(albumKey => {
            const album = response.albums[albumKey];
            if (!album.path || album.path === '') return;
            if (loadedAlbums.has(album.path)) return;
            loadedAlbums.add(album.path);
            fillCache(album.path);
        });
        console.log(`Cache size grown from ${oldSize} to ${cache.size}, loaded ${loadedAlbums.size} albums`);
    });
}

const file = (pathname, res, transform = (data) => data) => {
    console.log(`Loading ${pathname}...`)
    fs.exists(pathname, function (exist) {
        if (!exist) {
            // if the file is not found, return 404
            console.log(`File ${pathname} not found!`)
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }

        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.statusCode = 500;
                console.log(`Error getting the file: ${err}.`)
                res.end(`Error getting the file: ${err}.`);
            } else {
                const ext = path.parse(pathname).ext;

                // if the file is found, set Content-type and send data
                res.setHeader('Content-type', mimeType[ext] || 'text/plain');
                res.end(transform(data));
            }
        });
    });
}

const init = () => {
    fillCache("");
}

const startServer = () => {
    http.createServer(function (req, res) {
        const { method, url } = req;
        // server code
        console.log(`${method} ${url}`);

        if (url === '/random.jpg') {
            file('random.jpg', res, (data) => {
                const nextIndex = Math.floor(Math.random() * cache.size);
                console.log(`Loading image ${nextIndex} from set with ${cache.size} elements...`);
                const next = [...cache][nextIndex];
                cache.delete(next);
                if (cache.size < 5) fillCache("");
                const url_files = `https://${process.env.NEXTCLOUD_HOST}/index.php/apps/gallery/api/files/download/${next}`;
                get(url_files, asImg).then(() => { console.log('Downloaded new image'); });
                return data;
            });
        }
        else file(`index.html`, res, (data) => data);
    }).listen(9000);

    console.log('Server listening on port 9000');
}

init();
startServer();