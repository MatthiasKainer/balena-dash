
const {transform} = require("@babel/core");
const plugins = require('./plugins');
const fs = require("fs");
const path = require("path");

const browserify = (file, code, then) =>
    transform(code, {
        "presets": ["@babel/env"],
        "plugins": [
            "@babel/plugin-proposal-class-properties"
        ]
    }, (err, result) => {
        if (err) return console.error(`Transform failed for file ${file}:`, err)
        then(result.code)
    });

const webFiles = plugins
    .map(({__plugin_directory_name}) => `${__plugin_directory_name}/web.js`)

webFiles.forEach(web => {
    fs.readFile(web, { encoding: "utf8"}, (err, data) => {
        if (err) return console.error(`Failed for file ${web}:`, err)
        browserify(web, data, (result) => {
            const distFile = path.join(path.dirname(web), "web.dist.js");
            fs.writeFile(distFile, result, { encoding: "utf8" }, (err) => {
                if (err) return console.error(`Failed for file ${web}:`, err)
                console.log(`File ${web} transformed successfully to ${distFile}`)
            })
        })
    })
})