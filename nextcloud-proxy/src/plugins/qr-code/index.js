
const {loadFile} = require("../../net")

const id = "qr-code"
const endpoints = [{
    path: "/css",
    invoke: (req, res) => {
        loadFile(`${__dirname}/styles.css`, res);
    }
}];

module.exports = {
    id,
    webcomponent : id,
    endpoints
}