const id = "simple-reminder"
const {mimeType, loadFile} = require("../../net")
const {Reminder} = require("./reminder");

let reminder;

const setup = () => {
    const reminders = [
    ]
    reminder = Reminder(reminders)
};

const endpoints = [
    {
        path: "/reminder",
        method: "GET",
        invoke: (req, res) => {
            res.setHeader('Content-type', mimeType[".json"]);
            console.log(reminder.next());
            res.end(JSON.stringify(reminder.next()));
        }
    },
    {
        path: "/reminder",
        method: "DELETE",
        invoke: (req, res) => {
            reminder.close();
            res.end("OK")
        }
    },
    {
        path: "/css",
        invoke: (req, res) => {
            loadFile(`${__dirname}/styles.css`, res);
        }
    }];

module.exports = {
    id,
    webcomponent : id,
    setup,
    endpoints,
}