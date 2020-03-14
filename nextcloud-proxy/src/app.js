const http = require('http');
const https = require('https');
const {join} = require('path');
https.globalAgent.maxSockets = 1;
require('dotenv').config();

const plugins = require('./plugins');
const {mimeType, loadFile, loadFiles} = require("./net");

const init = () => {
    plugins.forEach(({id, setup}) => {setup && setup() && console.log(`Plugin ${id} initialized`)})
}

const pluginMatcher = (req, plugins) => {
    return plugins.reduce((prev, {id, endpoints}) => endpoints && endpoints.find(({path, method}) => {
        return (!id || !path)  ?
            console.log(`[ERROR] Invalid plugin not matched. Endpoint information:`, endpoints)
            : join("/", id, path) === req.url && (method || "GET") === req.method;
    }) || prev, false);
}

const startServer = () => {
    http.createServer(function (req, res) {
        const { method, url } = req;
        let plugin;
        // server code
        console.log(`${method} ${url}`);

        if (url.indexOf("/Digital-7") === 0) {
            loadFile("assets/" + url.substr(1), res);
        }
        else if (url === '/ios_clock.svg') {
            loadFile("assets/ios_clock.svg", res);
        }
        else if (url === "/css") {
            loadFile("assets/styles.css", res);
        }
        else if (url === "/js") {
            loadFile("assets/script.js", res);
        }
        else if (url === "/plugins") {
            loadFiles(
                plugins.map(({__plugin_directory_name}) => `${__plugin_directory_name}/web.dist.js`), 
                res,
                mimeType[".js"],
                undefined,
                (data) => data ? `(function() { ${data} })();` : ""
            );
        }
        else if ((plugin = pluginMatcher(req, plugins))) {
            console.log("[INFO] invoke plugin for route", plugin);
            plugin.invoke(req, res);
        }
        else loadFile(`index.html`, res, {encoding: "utf-8"}, (file) => {
            const webcomponents = plugins.reduce((prev, {webcomponent}) => webcomponent ? prev + `<${webcomponent}></${webcomponent}>` : prev, "");
            return file.replace("<plugins />", webcomponents);
        });
    }).listen(9000);

    console.log('Server listening on http://localhost:9000');
}

init();
startServer();