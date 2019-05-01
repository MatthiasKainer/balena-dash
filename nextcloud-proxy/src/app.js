const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
https.globalAgent.maxSockets = 1;
require('dotenv').config();
const { Reminder } = require("./server/reminder");

const { prepareNext, fillCache } = require("./server/nextcloud");

const mimeType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'appplication/json',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.css': 'text/css'
};

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
const reminders = [
    {
        day: 0,
        hour: 13,
        message: {
            headline: "It's sunday afternoon!",
            text: "Did you bring out the trash yet?"
        }
    },
]
const reminder = Reminder(reminders)

const startServer = () => {
    http.createServer(function (req, res) {
        const { method, url } = req;
        // server code
        console.log(`${method} ${url}`);

        if (url.indexOf("/Digital-7") === 0) {
            file("assets/" + url.substr(1), res);
        }
        else if (url === '/ios_clock.svg') {
            file("assets/ios_clock.svg", res);
        }
        else if (url === "/css") {
            file("assets/styles.css", res);
        }
        else if (url === "/js") {
            file("assets/script.js", res);
        }
        else if (url === '/next') {
            file('next.json', res, (data) => {
                prepareNext();
                return data;
            });
        }
        else if (url === '/reminder') {
            if (method === "POST") {
                reminder.close();
                res.end("OK")
            } else {
                res.setHeader('Content-type', mimeType[".json"]);
                console.log(reminder.next());
                res.end(JSON.stringify(reminder.next()));
            }
        }
        else if (url.indexOf('/random.jpg') === 0) {
            file('random.jpg', res, (data) => {
                prepareNext();
                return data;
            });
        }
        else file(`index.html`, res);
    }).listen(9000);

    console.log('Server listening on port 9000');
}

init();
startServer();