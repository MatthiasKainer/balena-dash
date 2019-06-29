const {readdirSync, lstatSync} = require("fs");
const {join} = require("path")

module.exports = readdirSync(__dirname)
    .filter(entry => lstatSync(join(__dirname, entry)).isDirectory())
    .map(module => ({...require(`./${module}`), __plugin_directory_name : `./plugins/${module}` }))