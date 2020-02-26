const id = "date-set-reminder"
const {mimeType, loadFile} = require("../../net")
const {Reminder} = require("./reminder");

let reminder;

const setup = () => {
    const reminders = `
    date; headline; text;
    2020-03-01T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-03-16T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-04-14T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-04-26T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-05-10T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-05-24T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-06-06T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-06-21T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-07-05T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-07-19T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-08-02T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-08-16T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-08-30T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-09-13T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-09-27T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-10-11T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-10-25T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-11-08T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-11-22T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-12-06T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-12-20T16:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-03-08T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-03-22T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-04-05T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-04-20T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-05-03T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-05-17T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-06-01T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-06-14T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-06-28T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-07-12T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-07-26T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-08-09T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-08-23T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-09-06T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-09-20T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-10-04T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-10-19T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-11-01T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-11-15T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-11-29T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-12-13T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-12-30T16:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-02-26T17:05:00; Papier!; Heute die blaue Tonne raus;
    2020-03-25T16:00:00; Papier!; Heute die blaue Tonne raus;
    2020-04-22T16:00:00; Papier!; Heute die blaue Tonne raus;
    2020-05-22T16:00:00; Papier!; Heute die blaue Tonne raus;
    2020-06-17T16:00:00; Papier!; Heute die blaue Tonne raus;
    2020-07-15T16:00:00; Papier!; Heute die blaue Tonne raus;
    2020-08-12T16:00:00; Papier!; Heute die blaue Tonne raus;
    2020-09-09T16:00:00; Papier!; Heute die blaue Tonne raus;
    2020-10-07T16:00:00; Papier!; Heute die blaue Tonne raus;
    2020-11-04T16:00:00; Papier!; Heute die blaue Tonne raus;
    2020-12-02T16:00:00; Papier!; Heute die blaue Tonne raus;
    2020-12-30T16:00:00; Papier!; Heute die blaue Tonne raus;
    2021-01-27T16:00:00; Papier!; Heute die blaue Tonne raus;
    2020-06-12; Happy Birthday Matthias!; Alles Gute zum Geburstag, Matthias!
    2020-08-02; Happy Birthday Greta!; Alles Gute zum Geburstag, Greta!
    2020-09-30; Happy Birthday Sammy!; Alles Gute zum Geburstag, Sammy!
    2021-01-02; Happy Birthday Sabrina!; Alles Gute zum Geburstag, Sabrina!
    `
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
            reminder.done();
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