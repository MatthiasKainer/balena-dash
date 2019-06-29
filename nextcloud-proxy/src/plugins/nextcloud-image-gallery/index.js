
const { prepareNext, fillCache } = require("./nextcloud");
const {loadFile} = require("../../net")
const id = "nextcloud/gallery";
const webcomponent = "nextcloud-gallery"

const setup = fillCache;
const endpoints = [
    {
        path: "/next",
        method: "GET",
        invoke: (req, res) => {
            loadFile(`${__dirname}/__data/next.json`, res, undefined, (data) => {
                prepareNext();
                return data;
            })
        }
    },
    {
        path: "/random.jpg",
        method: "GET",
        invoke: (req, res) => {
            loadFile(`${__dirname}/__data/random.jpg`, res, undefined, (data) => {
                prepareNext();
                return data;
            })
        }
    }];

module.exports = {
    id,
    webcomponent,
    setup,
    endpoints
}