const id = "date-set-reminder"
const {mimeType, loadFile} = require("../../net")
const {Reminder} = require("./reminder");

let reminder;

const setup = () => {
    const reminders = `
    date; headline; text;
    2020-03-01T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-03-15T19:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-03-29T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-04-14T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-04-26T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-05-10T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-05-24T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-06-06T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-06-21T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-07-05T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-07-19T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-08-02T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-08-16T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-08-30T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-09-13T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-09-27T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-10-11T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-10-25T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-11-08T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-11-22T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-12-06T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-12-20T15:00:00; Wertstoff!; Heute die Wertstofftonne vor die Tür
    2020-03-08T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-03-22T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-04-05T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-04-20T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-05-03T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-05-17T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-06-01T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-06-14T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-06-28T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-07-12T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-07-26T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-08-09T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-08-23T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-09-06T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-09-20T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-10-04T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-10-19T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-11-01T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-11-15T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-11-29T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-12-13T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-12-30T15:00:00; Restmülltag!; Heute die schwarze Tonne vor die Tür
    2020-02-26T17:05:00; Papier!; Heute die blaue Tonne raus;
    2020-03-25T15:00:00; Papier!; Heute die blaue Tonne raus;
    2020-04-22T15:00:00; Papier!; Heute die blaue Tonne raus;
    2020-05-22T15:00:00; Papier!; Heute die blaue Tonne raus;
    2020-06-17T15:00:00; Papier!; Heute die blaue Tonne raus;
    2020-07-15T15:00:00; Papier!; Heute die blaue Tonne raus;
    2020-08-12T15:00:00; Papier!; Heute die blaue Tonne raus;
    2020-09-09T15:00:00; Papier!; Heute die blaue Tonne raus;
    2020-10-07T15:00:00; Papier!; Heute die blaue Tonne raus;
    2020-11-04T15:00:00; Papier!; Heute die blaue Tonne raus;
    2020-12-02T15:00:00; Papier!; Heute die blaue Tonne raus;
    2020-12-30T15:00:00; Papier!; Heute die blaue Tonne raus;
    2021-01-27T15:00:00; Papier!; Heute die blaue Tonne raus;
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