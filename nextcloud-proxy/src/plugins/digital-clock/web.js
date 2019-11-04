

function getNow() {
    const offset = 1;
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
function getCurrentHoursMinutesSeconds() {
    const date = getNow();
    let hours = date.getHours(); // 0 - 23
    let minutes = date.getMinutes(); // 0 - 59
    let seconds = date.getSeconds(); // 0 - 59

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return { hours, minutes, seconds };
}
function getClockDigits() {
    const { hours, minutes, seconds } = getCurrentHoursMinutesSeconds();

    // create elements for each digit to avoid jumping of the ui when the 1 is shorter then the 0
    return join(...create(hours), ":", ...create(minutes), ":", ...create(seconds));
}

const digitalClock = "digital-clock";
const clockTemplate = document.createElement('template');
const digitTemplate = document.createElement('template');

clockTemplate.innerHTML = `
<style>
  .clock {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 200px;
    padding-top: 40px;
    height: 60px;
    font-size: 50px;
    color: white;
    opacity: 0.7;
    text-align: right;
    overflow: visible;
    vertical-align: text-bottom;
    z-index: 1000;
}
span {
    display:inline-block;
}
#hours, #minutes, #seconds {
    margin-right:12px;
}
</style>
<div id="clock" class="clock">
    <span id="hours">
        <${digitalClock}-character digit="0"></${digitalClock}-character>
        <${digitalClock}-character digit="0"></${digitalClock}-character>
    </span><span class="sep">:</span><span id="minutes">
        <${digitalClock}-character digit="0"></${digitalClock}-character>
        <${digitalClock}-character digit="0"></${digitalClock}-character>
    </span><span class="sep">:</span><span id="seconds">
        <${digitalClock}-character digit="0"></${digitalClock}-character>
        <${digitalClock}-character digit="0"></${digitalClock}-character>
    </span>
</div>
`;

digitTemplate.innerHTML = `
<style>
  .character {
    display: inline-block;
    width: 18px;
    text-align: right;
    padding: 5px 0;
    overflow: visible;
}
</style>
<span class="character"></span>
`;

class ClockCharacter extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "closed" });
        this.root.appendChild(digitTemplate.content.cloneNode(true));
        this.character = this.root.querySelector(".character");
    }

    static get observedAttributes() {
        return ['digit'];
      }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === "digit" && oldVal !== newVal) {
            this.setAttribute(attrName, newVal);
            this._showDigit();
        }
    }

    get digit() {
        return this.getAttribute("digit");
    }

    set digit(value) {
        this.setAttribute("digit", value);
    }

    connectedCallback() {
        this._showDigit();
    }

    _showDigit() {
        this.character.innerText = this.getAttribute("digit");
    }
}

class DigitalClock extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "closed" });
        this.root.appendChild(clockTemplate.content.cloneNode(true));
        this.clockContainer = this.root.getElementById("clock");

        // register in dashboards event loop
        registerHandler(digitalClock, {
            ticks: 5,
            duration: 5,
            run: () => this._showTime()
        });
    }

    connectedCallback() {
        this._showTime();
    }

    _showTime() {
        try {
            const time = getCurrentHoursMinutesSeconds();
            ["hours", "minutes", "seconds"].forEach(slot => {
                const clockCharacters = this.clockContainer.querySelectorAll(`#${slot} ${digitalClock}-character`);
                [...time[slot].toString()].map((digit, index) => {
                    clockCharacters[index].digit = digit;
                })
            });
        } catch (err) {
            console.log(err);
        }
    }
}

window.customElements.define(`${digitalClock}-character`, ClockCharacter);
window.customElements.define(digitalClock, DigitalClock);



