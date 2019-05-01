let lastTrashDay = new Date(0);

const reminders = [
    {
        day: 0,
        hour: 15,
        message: {
            headline: "It's sunday afternoon!",
            text: "Did you bring out the trash yet?"
        }
    }
]

const container = document.getElementById("container");
const img = document.getElementsByClassName("background")[0];

["click", "touchstart", "touchend", "touchmove"].forEach(eventType => {
    container.addEventListener(eventType, () => {
        container.style.display = "none";
        lastTrashDay = getNow();
    });
    img.addEventListener(eventType, () => {
        changeBackgroundImage();
    })
});

const activeReminder = reminders[0];

function trashReminder() {
    setTimeout(() => {
        const now = getNow();
        const day = now.getDay();
        if (day === activeReminder.day &&
            now.getHours() > activeReminder.hour &&
            !sameDay(now, lastTrashDay)) {
            const { message } = activeReminder;
            container.querySelector(".message h1").innerText = message.headline;
            container.querySelector(".message p").innerText = message.text;
            container.style.display = "block";
        }
        trashReminder();
    }, 60 * 1000)
}

trashReminder()

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

function getNow() {
    const offset = 2;
    // create Date object for current location
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    return new Date(utc + (3600000 * offset));
}

function create(value) {
    return [...value.toString()].map(character => {
        const element = document.createElement("span");
        element.className = "character";
        element.innerText = character;
        return element;
    });
}

function join(...elements) {
    return elements.map(current => {
        if (current.toString() === "[object HTMLSpanElement]") return current;
        return document.createTextNode(current);
    })
}

function showTime() {
    try {
        var date = getNow();
        var h = date.getHours(); // 0 - 23
        var m = date.getMinutes(); // 0 - 59
        var s = date.getSeconds(); // 0 - 59

        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;

        var time = join(...create(h), ":", ...create(m), ":", ...create(s));
        var clock = document.getElementById("clock");
        while (clock.firstChild) {
            clock.removeChild(clock.firstChild);
        }
        time.forEach(element => {
            clock.appendChild(element);
        });
    } catch (err) {

    }
}

function formatDate(date) {
    const monthNames = [
        "Januar", "Februar", "März",
        "April", "Mai", "Juni", "Juli",
        "August", "September", "Oktober",
        "November", "Dezember"
    ];

    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}


let backgroundTimeout;
function changeBackgroundImage() {
    if (backgroundTimeout) clearTimeout(backgroundTimeout);
    try {
        fetch('/next')
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                img.style.backgroundImage = `url("${myJson.result}")`;
            });
    } catch (err) {}
    backgroundTimeout = setTimeout(() => changeBackgroundImage(), 60 * 1000)
}

setInterval(() => showTime(), 50);