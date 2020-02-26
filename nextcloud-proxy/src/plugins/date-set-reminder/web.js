const clockTemplate = document.createElement('template');

const id = "date-set-reminder"
const reminderBasePath = `/${id}`;
const reminderUrl = `${reminderBasePath}/reminder`;

clockTemplate.innerHTML = `
<link media="all" rel="stylesheet" href="${reminderBasePath}/css">
  <div id="container">
        <div id="error-box">
            <div class="dot"></div>
            <div class="dot two"></div>
            <div class="face2">
                <div class="eye"></div>
                <div class="eye right"></div>
                <div class="mouth sad"></div>
            </div>
            <div class="shadow move"></div>
            <div class="message">
                <h1 class="alert">This is the headline</h1>
                <p>This is the text</p>
            </div>
            <button class="button-box">
                <h1 class="red">YES I DID</h1>
            </button>
        </div>
    </div>
`;


class DateSetReminder extends HTMLElement {
    constructor() {
        super();
        registerHandler(id, {
            ticks: 1500,
            duration: 1500,
            run: () => this._reminders()
        });
        this.root = this.attachShadow({ mode: "open" });
        this.root.appendChild(clockTemplate.content.cloneNode(true));
        this.container = this.root.querySelector("#container");

        ["click", "touchstart", "touchend", "touchmove"].forEach(eventType => {
            this.container.addEventListener(eventType, () => {
                this.container.style.display = "none";
                fetch(reminderUrl, {
                    method: "DELETE"
                })
                registeredHandlers[id].stopped = false;
            });
        });
    }

    connectedCallback() {
        this._reminders();
    }

    _reminders() {
        fetch(reminderUrl)
            .then(function (response) {
                return response.json();
            })
            .then((activeReminder) => {
                if (activeReminder !== null && !activeReminder.__empty) {
                    const { message } = activeReminder;
                    this.container.querySelector(".message h1").innerText = message.headline;
                    this.container.querySelector(".message p").innerText = message.text;
                    this.container.style.display = "block";
                    registeredHandlers[id].stopped = true;
                }
            });
    }

}

window.customElements.define(id, DateSetReminder);