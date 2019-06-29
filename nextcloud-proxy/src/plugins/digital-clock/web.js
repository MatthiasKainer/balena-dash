const template = document.createElement('template');

template.innerHTML = `
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

.clock * {
    margin-top: 5px;
}

.clock .character {
    display: inline-block;
    width: 24px;
    text-align: right;
    padding: 5px 0;
    overflow: visible;
}
  </style>
  <div id="clock" class="clock"></div>
`;

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

class DigitalClock extends HTMLElement {
    constructor() {
        super();
        registerHandler("digital-clock", {
            ticks: 1,
            duration: 1,
            run: () => this._showTime()
        });
        this.root = this.attachShadow({ mode: "open" });
        this.root.appendChild(template.content.cloneNode(true));
    }
    
    connectedCallback() {
        this._showTime();
    }

    _showTime() {
        try {
            var date = getNow();
            var h = date.getHours(); // 0 - 23
            var m = date.getMinutes(); // 0 - 59
            var s = date.getSeconds(); // 0 - 59
    
            h = (h < 10) ? "0" + h : h;
            m = (m < 10) ? "0" + m : m;
            s = (s < 10) ? "0" + s : s;
    
            var time = join(...create(h), ":", ...create(m), ":", ...create(s));
            var clock = this.root.getElementById("clock");
            while (clock.firstChild) {
                clock.removeChild(clock.firstChild);
            }
            time.forEach(element => {
                clock.appendChild(element);
            });
        } catch (err) {
    
        }
    }
    
}

window.customElements.define("digital-clock", DigitalClock);



