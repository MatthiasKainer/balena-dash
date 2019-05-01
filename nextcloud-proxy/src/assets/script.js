let lastTrashDay = new Date(0);
const container = document.getElementById("container");
container.addEventListener('click', () => {
    container.style.display = "none";
    lastTrashDay = getNow();
});

function trashReminder() {

    setTimeout(() => {
        const now = getNow();
        const day = now.getDay();
        if (day === 0 
            && now.getHours() > 15 
            && !sameDay(now, lastTrashDay)) {
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


function changeBackgroundImage() {
    fetch('/next')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            const img = document.getElementsByClassName("background")[0];
            img.style.backgroundImage = `url("${myJson.result}")`;
            return;
            const date = document.getElementById("date");
            while (date.firstChild) {
                date.removeChild(date.firstChild);
            }
            create(formatDate(new Date(myJson.meta.time))).forEach(element => {
                date.appendChild(element);
            });
        });
    //const img = document.getElementsByClassName("background")[0];
    //img.style.backgroundImage = `url("random.jpg?t=${new Date().getTime()}")`;
}

setInterval(() => showTime(), 50);
setInterval(() => changeBackgroundImage(), 30 * 1000);