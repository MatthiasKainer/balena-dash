const fs = require("fs");
const path = require("path");


const mimeType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'appplication/json',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.css': 'text/css'
};

const innerLoad = (pathname, options, transform = (data) => data) => {
    options = { ignoreNotFound : false, encoding : null, ...options };
    return new Promise((resolve, reject) => {
        fs.exists(pathname, function (exist) {
            if (!exist) {
                if (options.ignoreNotFound) {
                    resolve({
                        contentType: 'text/plain',
                        data: transform(null)
                    })
                } else {
                    reject({httpCode : 404, message: `File ${pathname} not found!`});
                    // still call transform as someone might require it...
                    try { transform(null); } catch (err) {}
                }
                return;
            }
    
            fs.readFile(pathname, { encoding: options.encoding }, function (err, data) {
                if (err) {
                    reject({httpCode: 500, message: `Error getting the file: ${err}.`});
                    // still call transform as someone might require it...
                    try { transform({}); } catch (err) {}
                } else {
                    const ext = path.parse(pathname).ext;
                    resolve({
                        contentType: mimeType[ext] || 'text/plain',
                        data: transform(data)
                    });
                }
            });
        });
    })

}

const loadFile = (pathname, res, options = { ignoreNotFound : false }, transform = (data) => data) => {
    console.log(`Loading ${pathname}...`)
    innerLoad(pathname, options)
        .then(({contentType, data}) => {
            res.setHeader('Content-Type', contentType);
            res.end(transform(data));
        })
        .catch(({httpCode, message}) => {
            console.log(`[ERROR][${httpCode}] ${message}`);
            res.statusCode = httpCode;
            // call transform as someone might require it
            transform({})
            res.end(message);
        });
}

const loadFiles = (pathnames, res, contentType, options = { ignoreNotFound : true }, transform = (data) => data, join = (previous, current) => previous + current) => {
    res.setHeader('Content-Type', contentType);
    Promise.all(pathnames.map(pathname => innerLoad(pathname, options, transform)))
        .then((allPromises) => {
            const merge = allPromises.reduce((previous, {data}) => {
                if (!previous) return data;
                return join(previous, data);
            }, null);
            res.end(merge);
        })
        .catch(({httpCode, message}) => {
            console.log(`[ERROR][${httpCode}] ${message}`);
            res.statusCode = httpCode;
            res.end(message);
        });
}

module.exports = {mimeType, loadFile, loadFiles}