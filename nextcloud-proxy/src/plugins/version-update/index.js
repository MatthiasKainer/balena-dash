const {mimeType} = require("../../net")
const id = "version-upgrade"
const endpoints = [
    {
        path: "/version",
        method: "GET",
        invoke: (req, res) => {
            res.setHeader('Content-type', mimeType[".json"]);
            const { name, version } = require("../../package.json");
            res.end(JSON.stringify({ name, version }));
        }
    }
];

module.exports = {
    id,
    webcomponent : id,
    endpoints
}